const player = mp.players.local;

const stateName = ['Position', 'Rotation'];
const attachTitleChat = '!{#4dd374}[ATTACH_EDITOR]!{#FFFFFF}';

const keysEditor = {
    R:      0x52, // CHANGE MODE
    Enter:  0x0D, // FINISH
    Back:   0x08, // CANCEL
    K:      0x20, // RESET
    L:      0x4C, // CHANGE FOV
    TAB:    0x09, // EDIT ATTACH
};

const keyMovement = {
    Left:       0x25,
    UP:         0x26,
    Right:      0x27,
    Down:       0x28,
    PageUp:     0x21,
    PageDown:   0x22,
    Shift:      0x10,

    AltLeft:    0xA4,
    X:          0x58,
    Y:          0x59,
    Z:          0x5A,

    Espacio:    0x20,
};

const MODE_MOVE     = 0;
const MODE_ROT      = 1;

const DEFAULT_CAMERA_FOV = 40;

const defaultCamera = mp.cameras.new("gameplay");
const ROT_XYZ = 5;

//

let editObject = null;
let editState = MODE_MOVE;
let objInfo = { object: '', body: 0, bodyIndex: 0, bodyName: '', x: 0.0, y: 0.0, z: 0.0, rx: 0.0, ry: 0.0, rz: 0.0 };
let camaraPos = { x: 0.0, y: 0.0, z: 0.0 };

var editInterval = null;
var editBrowser = null;
var editCamera = null;

mp.gui.chat.push(`${attachTitleChat} Use /attach [object] or TAB to open menu!`);

//

mp.events.add('attachObject', (object) => {

    if(editObject != null) return mp.gui.chat.push(`${attachTitleChat} You are already editting an object!`);

    if(editBrowser == null) {
        editBrowser = mp.browsers.new('package://attach_editor/attach_editor.html');

    } else {
        editBrowser.execute('setupAttachEditor();');
        editBrowser.active = true;
    }

    //
    
    editState = MODE_MOVE;
    objInfo.object = object;

    objInfo.x = objInfo.y = objInfo.z = 0.0;
    objInfo.rx = objInfo.ry = objInfo.rz = 0.0;

    player.freezePosition(true);
    mp.gui.cursor.show(true, true);
});

mp.events.add('closeEditorAttach', () => {
    player.freezePosition(false);
    editBrowser.active = false;

    mp.gui.cursor.show(false, false);
    mp.events.callRemote('finishAttach', JSON.stringify({ cancel: true }));
})

mp.events.add('removeObjectAttach', (objectId) => {

    // REMOVE ALL

    if(objectId == -1) {
        mp.objects.forEach(e => {
            if(e.attach != undefined) e.destroy();
        });

        return;
    }

    //

    const object = mp.objects.at(objectId);
    if(object == null) {
        return mp.events.callRemote('finishAttach', JSON.stringify({ cancel: true }));
    }

    mp.gui.chat.push(`${attachTitleChat} object ${object.attach.objectName} removed!`);
    object.destroy();
});

mp.events.add('editAttachObject', (objectId) => {
    const object = mp.objects.at(objectId);
    if(object == null) {
        return mp.events.callRemote('finishAttach', JSON.stringify({ cancel: true }));
    }

    mp.gui.cursor.show(false, false);

    //

    editObject = object;
    objInfo.body = object.attach.body;
    objInfo.object = object.attach.objectName;

    objInfo.x = editObject.attach.pos.x;
    objInfo.y = editObject.attach.pos.y;
    objInfo.z = editObject.attach.pos.z;

    objInfo.rx = editObject.attach.rot.x;
    objInfo.ry = editObject.attach.rot.y;
    objInfo.rz = editObject.attach.rot.z;

    objInfo.boneName = editObject.attach.boneName;
    objInfo.boneIndex = editObject.attach.boneIndex;

    setupCamera(object.attach.boneIndex);
});

mp.events.add('startAttachObject', (boneIndex, boneName) => {
    mp.gui.chat.push(`${attachTitleChat} You start the attach editor!`);
    mp.gui.cursor.show(false, false);

    const hashModel = mp.game.joaat(objInfo.object);

    editObject = mp.objects.new(hashModel, player.position, {
        rotation: new mp.Vector3(0, 0, 0),
        alpha: 255,
        dimension: player.dimension
    });

    if(editObject == null) {
        mp.events.callRemote('finishAttach', JSON.stringify({ cancel: true }));
        editBrowser.active = false;

        player.freezePosition(false);

        return mp.gui.chat.push(`${attachTitleChat} invalid object!`);
    }

    //

    setTimeout(() => {

        objInfo.bodyName = boneName;
        objInfo.boneIndex = boneIndex;
        objInfo.body = player.getBoneIndex(boneIndex);
        editObject.attachTo(player.handle, objInfo.body, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, false, false, false, 2, true);

        editObject.attach = { bodyName: boneName, body: objInfo.body, boneIndex: boneIndex, objectName: objInfo.object, pos: {x: 0.0, y: 0.0, z: 0.0 }, rot: {x: 0.0, y: 0.0, z: 0.0 } };

        // CAMERA

        setupCamera(boneIndex);
    
    }, 200);
});

//

function editAttachObject() {

    if(editObject == null) return;

    //player.clearTasks();
    //mp.game.invoke('0x176CECF6F920D707', player.handle); // CLEAR_PED_SECONDARY_TASK
    mp.game.invoke('0xC11C18092C5530DC', player.handle, false); // SET_PED_CAN_HEAD_IK
    mp.game.invoke('0x6C3B4D6D13B4C841', player.handle, false); // SET_PED_CAN_ARM_IK
    mp.game.invoke('0xF2B7106D37947CE0', player.handle, false); // SET_PED_CAN_TORSO_IK
    mp.game.invoke('0xBAF20C5432058024', player.handle, false); // SET_PED_CAN_PLAY_GESTURE_ANIMS
    mp.game.invoke('0xF833DDBA3B104D43', player.handle, false, false); // SET_PED_CAN_PLAY_VISEME_ANIMS
    mp.game.invoke('0x6373D1349925A70E', player.handle, false); // SET_PED_CAN_PLAY_AMBIENT_ANIMS
    mp.game.invoke('0x0EB0585D15254740', player.handle, false); // SET_PED_CAN_PLAY_AMBIENT_BASE_ANIMS

    // CAMERA

    if(mp.keys.isDown(keyMovement.Espacio) === true) {

        let dist = editCamera.getFov() == DEFAULT_CAMERA_FOV ? 1.2 : 2.0;
        
        const default_pos = defaultCamera.getCoord();
        const default_rot = defaultCamera.getRot(ROT_XYZ);
        const position = editObject.getCoords(true);

        const angle = default_rot.z * Math.PI / 180.0;

        const x = position.x + dist * Math.sin(angle);
        const y = position.y + dist * Math.cos(angle);

        editCamera.setCoord(x, y, default_pos.z);
        return;
    }

    var pos = { x: 0.0, y: 0.0, z: 0.0 };
    var speed = 1.0;

    const movement = editState == MODE_ROT ? 1.0 : 0.01 ;

    if(mp.keys.isDown(keyMovement.Shift) === true)      speed = 2.0;
    if(mp.keys.isDown(keyMovement.Left) === true)       pos.x -= movement;
    if(mp.keys.isDown(keyMovement.Right) === true)      pos.x += movement;
    if(mp.keys.isDown(keyMovement.UP) === true)         pos.y += movement;
    if(mp.keys.isDown(keyMovement.Down) === true)       pos.y -= movement;
    if(mp.keys.isDown(keyMovement.PageUp) === true)     pos.z += movement;
    if(mp.keys.isDown(keyMovement.PageDown) === true)   pos.z -= movement;

    //

    pos.x *= speed;
    pos.y *= speed;
    pos.z *= speed;

    if(editState == MODE_MOVE) {
        objInfo.x += pos.x;
        objInfo.y += pos.y;
        objInfo.z += pos.z;
    
        editBrowser.execute(`updateObjectCoords(${objInfo.x}, ${objInfo.y}, ${objInfo.z});`);

    } else if(editState == MODE_ROT) {
        objInfo.rx += pos.x;
        objInfo.ry += pos.y;
        objInfo.rz += pos.z;
    
        editBrowser.execute(`updateObjectRot(${objInfo.rx}, ${objInfo.ry}, ${objInfo.rz});`);
    }

    // RESET SINGLE COORD

    if(mp.keys.isDown(keyMovement.AltLeft) == true) {

        if(mp.keys.isDown(keyMovement.X) === true) {

            if(editState == MODE_MOVE && objInfo.x != 0.0) { 
                objInfo.x = 0.0; 
                mp.gui.chat.push(`${attachTitleChat} Reset X coord!`);

            } else if(objInfo.rx != 0.0) {
                objInfo.rx = 0.0;
                mp.gui.chat.push(`${attachTitleChat} Reset X rot!`);
            }
        }

        if(mp.keys.isDown(keyMovement.Y) === true) {

            if(editState == MODE_MOVE && objInfo.y != 0.0) { 
                objInfo.y = 0.0; 
                mp.gui.chat.push(`${attachTitleChat} Reset Y coord!`);

            } else if(objInfo.ry != 0.0) {
                objInfo.ry = 0.0;
                mp.gui.chat.push(`${attachTitleChat} Reset Y rot!`);
            }
        }
        if(mp.keys.isDown(keyMovement.Z) === true) {

            if(editState == MODE_MOVE && objInfo.z != 0.0) { 
                objInfo.z = 0.0; 
                mp.gui.chat.push(`${attachTitleChat} Reset Z coord!`);

            } else if(objInfo.rz != 0.0) {
                objInfo.rz = 0.0;
                mp.gui.chat.push(`${attachTitleChat} Reset Z rot!`);
            }
        }
    }

    //

    editObject.attachTo(
        player.handle,
        objInfo.body,
        objInfo.x,
        objInfo.y,
        objInfo.z,
        objInfo.rx,
        objInfo.ry,
        objInfo.rz,
        true,
        false,
        false,
        false,
        2,
        true
    );
}

// KEYS

mp.keys.bind(keysEditor.Enter, true, function() {
    if(editObject == null || mp.gui.cursor.visible) return;

    mp.gui.chat.push(`${attachTitleChat} FINISH`);

    editObject.attach.pos.x = objInfo.x;
    editObject.attach.pos.y = objInfo.y;
    editObject.attach.pos.z = objInfo.z;

    editObject.attach.rot.x = objInfo.rx;
    editObject.attach.rot.y = objInfo.ry;
    editObject.attach.rot.z = objInfo.rz;

    editObject.attach.editDate = new Date();

    mp.events.callRemote('finishAttach', JSON.stringify(objInfo));
    finishEdition();
});

mp.keys.bind(keysEditor.K, true, function() {
    if(editObject == null || mp.gui.cursor.visible) return;

    mp.gui.chat.push(`${attachTitleChat} RESET`);

    objInfo.x = objInfo.y = objInfo.z = 0.0;
    objInfo.rx = objInfo.ry = objInfo.rz = 0.0;
});

mp.keys.bind(keysEditor.R, true, function() {
    if(editObject == null || mp.gui.cursor.visible) return;

    if(editState == MODE_MOVE) {
        editState = MODE_ROT;
        editBrowser.execute('changeModeEditor(\'ROT\');');

    } else if(editState == MODE_ROT) {
        editState = MODE_MOVE;
        editBrowser.execute('changeModeEditor(\'MOVEMENT\');');
    }
});

mp.keys.bind(keysEditor.Back, true, function() {
    if(editObject == null || mp.gui.cursor.visible) return;

    mp.gui.chat.push(`${attachTitleChat} CANCEL`);

    mp.events.callRemote('finishAttach', JSON.stringify({ cancel: true }));
    finishEdition(true);
});

mp.keys.bind(keysEditor.L, true, function() {
    if(editObject == null || mp.gui.cursor.visible) return;

    if(editCamera.getFov() == DEFAULT_CAMERA_FOV)   editCamera.setFov(DEFAULT_CAMERA_FOV * 2);
    else                                            editCamera.setFov(DEFAULT_CAMERA_FOV);
});

mp.keys.bind(keysEditor.TAB, true, function() {
    if(editObject != null || mp.gui.cursor.visible) return;

    var objects = [];
    
    mp.objects.forEach(e => {
        if(e.attach == undefined) return;
        objects.push({ id: e.id, bodyName: e.attach.bodyName, objectName: e.attach.objectName, editDate: e.attach.editDate });
    });
    
    //if(objects.length == 0) return mp.gui.chat.push(`${attachTitleChat} there are no attached objects!`);

    //
        
    if(editBrowser == null) {
        editBrowser = mp.browsers.new('package://attach_editor/attach_editor.html');
    }

    objects = JSON.stringify(objects);
    editBrowser.execute(`objectsEdit = JSON.parse('${objects}'); setupListAttachEdit();`);
    editBrowser.active = true;

    //

    player.freezePosition(true);
    mp.gui.cursor.show(true, true);

    mp.players.callRemote('startEditAttachServer');
});

// RENDER

mp.events.add('render', () => {
    if(editObject == null || mp.keys.isDown(keyMovement.Espacio)) return;
    
    mp.game.controls.disableAllControlActions(0);
    mp.game.controls.disableAllControlActions(1);

    mp.game.controls.disableAllControlActions(INPUT_MOVER);
});

// UTILS

function finishEdition(remove=false) {
    
    mp.game.cam.setGameplayCamRelativeHeading(0.0);

    //

    if(editCamera != null) {
        mp.game.cam.renderScriptCams(false, true, 1000, true, false);
        editCamera.destroy();
    }

    if(editInterval != null) clearInterval(editInterval);

    if(remove == true) editObject.destroy();
    editObject = editInterval = editCamera = null;

    player.freezePosition(false);
    editBrowser.active = false;
}

function setupCamera(boneIndex) {
    
    const pos           = player.getWorldPositionOfBone(objInfo.body);
    const player_pos    = player.getCoords(true);
    const forward_x     = player.getForwardX();
    const forward_y     = player.getForwardY();

    camaraPos.x = player_pos.x + forward_x;
    camaraPos.y = player_pos.y + forward_y;
    camaraPos.z = pos.z;

    editCamera = mp.cameras.new('attach_editor_camera', new mp.Vector3(camaraPos.x, camaraPos.y, pos.z), new mp.Vector3(0, 0, 0), DEFAULT_CAMERA_FOV);

    editCamera.setActive(true);
    editCamera.pointAtPedBone(player.handle, boneIndex, 0.0, 0.0, 0.0, true);

    mp.game.cam.renderScriptCams(true, true, 1000, true, false);

    //

    editInterval = setInterval(editAttachObject, 50);
}