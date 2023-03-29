const fs = require('fs');

const bodyParts = [
 	{ name: 'Skel root', id: 0 },
	{ name: 'Right hand', id: 57005 },
	{ name: 'Left hand', id: 18905 },
	{ name: 'Head', id: 12844 }
];

mp.events.addCommand('attach', (player, _, object, body) => {

	if(object == undefined) {
		return player.outputChatBox('!{#ff0000}/attach [object_name] [body_part_id]');
	}

	if(body == undefined) {
		bodyParts.forEach(e => {
			player.outputChatBox(e.name+ ' - ' +e.id);
		});
		return;
	}

	const bodyID = parseInt(body);
	if(isNaN(bodyID)) return;

	player.call("attachObject", [ object, bodyID ]);
});

mp.events.add('finishAttach', (player, object) => {

	let objectJSON = JSON.parse(object);
	let text = `{ ${objectJSON.object}, ${objectJSON.body}, ${objectJSON.x.toFixed(4)}, ${objectJSON.y.toFixed(4)}, ${objectJSON.z.toFixed(4)}, ${objectJSON.rx.toFixed(4)}, ${objectJSON.ry.toFixed(4)}, ${objectJSON.rz.toFixed(4)} },\r\n`;
	
	player.outputChatBox(text);

	fs.appendFile('./attachments.txt', text, err => {

		if (err) {
		  console.error(err)
		  return
		}
	});
});