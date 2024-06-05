import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

function Formlogin() {
	const [users, setUsers] = useState([])
  
	useEffect(() => {
	  fetch("https://snapchat.epidoc.eu/user")
		.then(response => response.json())
		.then(json => setUsers(json))
	}, [])
  
	return (
	  <div className="App">
		<table class="bp4-html-table .modifier">
		  <thead>
			<tr>
			  <th>email</th>
			  <th>username</th>
			  <th>profilePicture</th>
			  <th>password</th>
			  
			</tr>
		  </thead>
		  <tbody>
			{users.map(user => (
			  <tr key={user.id}>
				<td>{user.email}</td>
				<td>{user.username}</td>
				<td>{user.profilePicture}</td>
				<td>{user.password}</td>
				<td>
				  <EditableText value={user.email} />
				</td>
				<td>
				  <EditableText value={user.username} />
				</td>
				<td>
				  <Button intent="primary">Update</Button>
				  &nbsp;
				  <Button intent="danger">Delete</Button>
				</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	)
  }

  export default Formlogin