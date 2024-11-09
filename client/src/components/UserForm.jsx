import { useState } from 'react';

const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);

  const createUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        alert('User created successfully!');
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);

      if (response.ok) {
        const fetchedUser = await response.json();
        setUser(fetchedUser);
      } else {
        console.error('Failed to fetch user:', response.statusText);
        alert('User not found');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>User Management</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
        className='mb-4'
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type='text'
          placeholder='Name'
          className='border p-2 w-full mb-2'
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type='email'
          placeholder='Email'
          className='border p-2 w-full mb-2'
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          placeholder='Password'
          className='border p-2 w-full mb-2'
          required
        />
        <button type='submit' className='bg-blue-500 text-white p-2 w-full'>
          Create User
        </button>
      </form>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        type='text'
        placeholder='User ID'
        className='border p-2 w-full mb-2'
      />
      <button
        onClick={fetchUser}
        className='bg-green-500 text-white p-2 w-full'
      >
        Fetch User
      </button>
      {user && (
        <div className='mt-4'>
          <h2 className='text-xl font-semibold'>User Details:</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserForm;
