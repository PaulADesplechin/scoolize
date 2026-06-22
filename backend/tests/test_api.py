def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_create_and_get_student(client):
    r = client.post(
        "/api/students",
        json={
            "first_name": "Léa",
            "last_name": "Martin",
            "email": "lea@example.com",
            "password": "secret123",
        },
    )
    assert r.status_code == 201, r.text
    sid = r.json()["id"]
    r2 = client.get(f"/api/students/{sid}")
    assert r2.status_code == 200
    assert r2.json()["email"] == "lea@example.com"
    assert r2.json()["grades"] == []


def test_duplicate_email_rejected(client):
    body = {
        "first_name": "A",
        "last_name": "B",
        "email": "dup@example.com",
        "password": "secret123",
    }
    assert client.post("/api/students", json=body).status_code == 201
    assert client.post("/api/students", json=body).status_code == 409


def test_grades_require_auth(client, register):
    sid, _ = register("noauth@example.com")
    r = client.post(
        f"/api/students/{sid}/grades", json=[{"subject": "Maths", "value": 12}]
    )
    assert r.status_code in (401, 403)


def test_login_and_add_grades(client, register):
    sid, headers = register("tom@example.com")
    r = client.post(
        f"/api/students/{sid}/grades",
        headers=headers,
        json=[
            {"subject": "Mathématiques", "value": 15.5, "period": "Trimestre 1"},
            {"subject": "Physique-Chimie", "value": 13.0, "period": "Trimestre 1"},
        ],
    )
    assert r.status_code == 200, r.text
    assert len(r.json()) == 2
    profile = client.get(f"/api/students/{sid}").json()
    assert len(profile["grades"]) == 2


def test_cannot_add_grades_to_other_student(client, register):
    _, headers_a = register("a@example.com")
    sid_b, _ = register("b@example.com")
    r = client.post(
        f"/api/students/{sid_b}/grades",
        headers=headers_a,
        json=[{"subject": "Maths", "value": 10}],
    )
    assert r.status_code == 403


def test_create_and_filter_programs(client, register):
    _, headers = register("prepare@example.com")
    r = client.post(
        "/api/programs",
        headers=headers,
        json={
            "name": "CPGE MPSI",
            "institution": "Lycée Louis-le-Grand",
            "type": "selective",
            "domain": "Sciences",
            "region": "Île-de-France",
            "min_average": 16.0,
            "admission_rate": 0.12,
            "key_subjects": {"Mathématiques": 0.5, "Physique-Chimie": 0.3},
        },
    )
    assert r.status_code == 201, r.text
    client.post(
        "/api/programs",
        headers=headers,
        json={
            "name": "Licence Histoire",
            "institution": "Université Paris 1",
            "type": "non_selective",
            "domain": "Lettres",
            "region": "Île-de-France",
        },
    )
    selective = client.get("/api/programs?type=selective").json()
    assert selective and all(p["type"] == "selective" for p in selective)
    assert any(p["name"] == "CPGE MPSI" for p in selective)


def test_match_and_apply(client, register):
    sid, headers = register("match@example.com")
    client.post(
        f"/api/students/{sid}/grades",
        headers=headers,
        json=[
            {"subject": "Mathématiques", "value": 17},
            {"subject": "Physique-Chimie", "value": 16},
        ],
    )
    pid = client.post(
        "/api/programs",
        headers=headers,
        json={
            "name": "BUT Informatique",
            "institution": "IUT Paris",
            "type": "selective",
            "min_average": 12.0,
        },
    ).json()["id"]

    matches = client.get(f"/api/match/{sid}").json()
    assert len(matches) >= 1
    assert matches[0]["score"] >= 0
    assert "category" in matches[0]

    appli = client.post(
        "/api/applications", headers=headers, json={"program_id": pid}
    )
    assert appli.status_code == 201, appli.text
    mine = client.get("/api/applications/me", headers=headers).json()
    assert any(a["program_id"] == pid for a in mine)


def test_candidates_endpoint_for_prepare(client, register):
    sid, headers = register("cand@example.com")
    # création de formation sans auth (portail Prepare ouvert)
    pid = client.post(
        "/api/programs",
        json={
            "name": "BUT Informatique",
            "institution": "IUT Paris",
            "type": "selective",
            "min_average": 12.0,
        },
    ).json()["id"]
    client.post("/api/applications", headers=headers, json={"program_id": pid})

    candidates = client.get("/api/candidates").json()
    assert any(c["program_id"] == pid and c["application_id"] for c in candidates)
    filtered = client.get(f"/api/candidates?program_id={pid}").json()
    assert filtered and all(c["program_id"] == pid for c in filtered)


def test_candidate_detail_returns_evolution_and_comparison(client, register):
    sid, headers = register("detail@example.com")
    client.post(
        f"/api/students/{sid}/grades",
        headers=headers,
        json=[
            {"subject": "Mathématiques", "value": 17},
            {"subject": "Physique-Chimie", "value": 16},
        ],
    )
    pid = client.post(
        "/api/programs",
        json={
            "name": "BUT Informatique",
            "institution": "IUT",
            "type": "selective",
            "min_average": 12.0,
            "key_subjects": {"Mathématiques": 0.5, "NSI": 0.3},
        },
    ).json()["id"]
    aid = client.post(
        "/api/applications", headers=headers, json={"program_id": pid}
    ).json()["id"]

    r = client.get(f"/api/candidates/{aid}")
    assert r.status_code == 200
    data = r.json()
    assert data["application_id"] == aid
    assert data["student_id"] == sid
    assert len(data["grades"]) == 2

    assert {e["subject"] for e in data["evolution"]} == {"Mathématiques", "Physique-Chimie"}
    maths_evolution = next(e for e in data["evolution"] if e["subject"] == "Mathématiques")
    assert maths_evolution["t3"] == 17.0
    assert maths_evolution["t2"] < maths_evolution["t3"]
    assert maths_evolution["t1"] < maths_evolution["t2"]

    by_subject = {c["subject"]: c for c in data["comparison"]}
    assert by_subject["Mathématiques"]["student_average"] == 17
    assert by_subject["Mathématiques"]["meets_minimum"] is True
    assert by_subject["NSI"]["student_average"] is None


def test_candidate_status_update(client, register):
    sid, headers = register("status@example.com")
    pid = client.post(
        "/api/programs",
        json={"name": "Licence", "institution": "U", "type": "non_selective"},
    ).json()["id"]
    aid = client.post(
        "/api/applications", headers=headers, json={"program_id": pid}
    ).json()["id"]

    r = client.patch(f"/api/candidates/{aid}", json={"status": "accepted"})
    assert r.status_code == 200
    assert r.json()["status"] == "accepted"

    r2 = client.patch(f"/api/candidates/{aid}", json={"status": "rejected"})
    assert r2.json()["status"] == "rejected"

    r3 = client.patch("/api/candidates/9999", json={"status": "accepted"})
    assert r3.status_code == 404


def test_prepare_stats(client, register):
    sid1, h1 = register("stat1@example.com")
    sid2, h2 = register("stat2@example.com")

    p1 = client.post(
        "/api/programs",
        json={
            "name": "BUT Informatique",
            "institution": "IUT",
            "type": "selective",
            "capacity": 100,
        },
    ).json()["id"]
    p2 = client.post(
        "/api/programs",
        json={
            "name": "Licence Maths",
            "institution": "U",
            "type": "non_selective",
            "capacity": 500,
        },
    ).json()["id"]

    client.post("/api/applications", headers=h1, json={"program_id": p1})
    client.post("/api/applications", headers=h2, json={"program_id": p1})
    client.post("/api/applications", headers=h1, json={"program_id": p2})

    r = client.get("/api/prepare/stats")
    assert r.status_code == 200
    data = r.json()
    assert data["total_candidates"] == 3
    by_pid = {p["program_id"]: p for p in data["by_program"]}
    assert by_pid[p1]["nb_candidates"] == 2
    assert by_pid[p2]["nb_candidates"] == 1
    assert by_pid[p1]["fill_rate"] == 0.02
    assert by_pid[p2]["fill_rate"] == 0.002
    assert by_pid[p1]["nb_candidates"] >= by_pid[p2]["nb_candidates"]
