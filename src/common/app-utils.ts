import bcrypt from 'bcrypt';

async function hashPassword(passwordToHash: string, saltRounds: number) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(passwordToHash, salt);
  
      console.log('Password:', passwordToHash);
      console.log('Hashed Password:', hashedPassword);
      return hashedPassword;
    } catch (error) {
      console.error('Error:', error);
    }
  
}

