const BASE_URL = 'http://127.0.0.1:8000/security-users';

export async function getSecurityUsers() {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch security users');
  }

  return res.json();
}

export async function createSecurityUser(payload) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to create security user');
  }

  return res.json();
}

export async function updateSecurityUser(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to update security user');
  }

  return res.json();
}

export async function deleteSecurityUser(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete security user');
  }

  return true;
}
