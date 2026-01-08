const users = [
 {id:1,name:"boom",role:"admin"},
 {id:2,name:"bm",role:"member"} 
 
];

function getUsers(req,res) {
// return ข้อมูล json ของตัวแปร array ชื่อว่า users
  // return res.json(users);
  return res.render('users',{users})
}

function addUsers(req, res) {
  const {name,role} = req.body;

  const newUser = {
    id: users.length + 1,
    name,
    role
  };
  
  users.push(newUser);

  return res.redirect('/users');
}


function removeUsers(req, res) {
  // const {name,role} = req.body;
  users.pop(users);
  return res.redirect('/users');
}

module.exports = {getUsers,addUsers}; 