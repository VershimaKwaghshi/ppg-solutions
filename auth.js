async function registerUser(userData) {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    country,
    referral,
    risk,
    role
  } = userData;

  const referralCode = generateReferralCode();

  const { data: authData, error: authError } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: firstName + ' ' + lastName,
        risk_tier: risk,
        parent_referral_id: referral,
        payment_method: 'Crypto Stream'
      }
    }
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const user = authData.user;
  if (!user) {
    throw new Error('No user instance returned from authentication system.');
  }

  const { error: profileError } = await sb
    .from('profiles')
    .insert({
      id: user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      full_name: firstName + ' ' + lastName,
      phone,
      country,
      role,
      referral_code: referralCode,
      referred_by: referral,
      risk_tier: risk
    });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    success: true,
    user,
    referralCode
  };
}

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'PPG-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
