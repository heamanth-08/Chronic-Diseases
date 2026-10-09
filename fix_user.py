import sys
sys.path.insert(0, '.')
from backend.database import SessionLocal
from backend.models.user import User
from backend.services.auth_service import get_password_hash, verify_password

db = SessionLocal()
users = db.query(User).all()
print(f"Total users in DB: {len(users)}")
for u in users:
    print(f"  - {u.email} | id={u.id} | active={u.is_active} | profile={u.profile is not None}")

# Reset password for heamx08@gmail.com
user = db.query(User).filter(User.email == 'heamx08@gmail.com').first()
if user:
    new_hash = get_password_hash('12345678')
    user.hashed_password = new_hash
    user.is_active = True
    db.commit()
    db.refresh(user)
    ok = verify_password('12345678', user.hashed_password)
    print(f"\nPassword reset done. Verify: {ok}")
else:
    print("User heamx08@gmail.com not found - creating it")
    user = User(email='heamx08@gmail.com', hashed_password=get_password_hash('12345678'), full_name='Heamanth', is_active=True)
    db.add(user)
    db.commit()
    print("User created.")

db.close()
