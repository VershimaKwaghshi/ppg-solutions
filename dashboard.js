async function getCurrentUser(){
  const {
    data:{ user },
    error
  } = await sb.auth.getUser();
  if(error || !user){
    return null;
  }
  return user;
}

async function getProfile(userId){
  const {
    data,
    error
  } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if(error){
    throw new Error(error.message);
  }
  return data;
}

async function requireAuth(){
  const user = await getCurrentUser();
  if(!user){
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

async function requireRole(expectedRole){
  const user = await requireAuth();
  if(!user){
    return null;
  }
  try {
    const profile = await getProfile(user.id);
    
    // If the logged-in user matches the expected role for this page, let them through
    if(profile.role === expectedRole){
      return { user, profile };
    }
    
    // Fallback Routing Matrix if they do not match
    if(profile.role === 'trader'){
      window.location.href = 'trader-dashboard.html';
    }
    else if(profile.role === 'manager'){
      window.location.href = 'manager-dashboard.html';
    }
    else {
      // Catch-all safety net for unassigned roles, admins, or pending approvals
      window.location.href = 'login.html';
    }
    return null;
  } catch (err) {
    window.location.href = 'login.html';
    return null;
  }
}

async function logout(){
  await sb.auth.signOut();
  window.location.href = 'login.html';
}
