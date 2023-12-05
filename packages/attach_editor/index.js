const fs = require('fs');
const fileSave = 'attachments.txt';

var edittingObject = false;

//

mp.events.addCommand('attach', (player, _, object) => {
	if(edittingObject == true) return player.outputChatBox('!{#ff0000}Already editting an object!');
	if(object == undefined) return player.outputChatBox('!{#ff0000}/attach [object_name]');

	player.call("attachObject", [ object ]);
	edittingObject = true;
});

//

mp.events.add('startEditAttachServer', () => {
	edittingObject = true;
});

mp.events.add('finishAttach', (player, object) => {

	edittingObject = false;

	const objectJSON = JSON.parse(object);
	if(objectJSON.cancel == true) return;

	const text = `[ '${objectJSON.bodyName}', ${objectJSON.boneIndex}, '${objectJSON.object}', ${objectJSON.body}, ${objectJSON.x.toFixed(4)}, ${objectJSON.y.toFixed(4)}, ${objectJSON.z.toFixed(4)}, ${objectJSON.rx.toFixed(4)}, ${objectJSON.ry.toFixed(4)}, ${objectJSON.rz.toFixed(4)} ],\r\n`;
	
	player.outputChatBox(text);

	fs.appendFile(fileSave, text, err => {

		if (err) {
		  console.error(err)
		  return
		}
	});
});