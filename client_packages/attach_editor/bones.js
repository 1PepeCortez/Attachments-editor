const bonesCommon = [
    { name: 'SKEL_ROOT', id: 0 },
	{ name: 'SKEL_R_Hand', id: 57005 },
	{ name: 'SKEL_L_Hand', id: 18905 },
	{ name: 'IK_Head', id: 12844 }
];

const bonesGeneral = [
    { name: "FB_R_Brow_Out_000", id: 1356 },
    { name: "SKEL_L_Toe0", id: 2108 },
    { name: "MH_R_Elbow", id: 2992 },
    { name: "SKEL_L_Finger01", id: 4089 },
    { name: "SKEL_L_Finger02", id: 4090 },
    { name: "SKEL_L_Finger31", id: 4137 },
    { name: "SKEL_L_Finger32", id: 4138 },
    { name: "SKEL_L_Finger41", id: 4153 },
    { name: "SKEL_L_Finger42", id: 4154 },
    { name: "SKEL_L_Finger11", id: 4169 },
    { name: "SKEL_L_Finger12", id: 4170 },
    { name: "SKEL_L_Finger21", id: 4185 },
    { name: "SKEL_L_Finger22", id: 4186 },
    { name: "RB_L_ArmRoll", id: 5232 },
    { name: "IK_R_Hand", id: 6286 },
    { name: "RB_R_ThighRoll", id: 6442 },
    { name: "SKEL_R_Clavicle", id: 10706 },
    { name: "FB_R_Lip_Corner_000", id: 11174 },
    { name: "SKEL_Pelvis", id: 11816 },
    //{ name: "IK_Head", id: 12844 },
    { name: "SKEL_L_Foot", id: 14201 },
    { name: "MH_R_Knee", id: 16335 },
    { name: "FB_LowerLipRoot_000", id: 17188 },
    { name: "FB_R_Lip_Top_000", id: 17719 },
    //{ name: "SKEL_L_Hand", id: 18905 },
    { name: "FB_R_CheekBone_000", id: 19336 },
    { name: "FB_UpperLipRoot_000", id: 20178 },
    { name: "FB_L_Lip_Top_000", id: 20279 },
    { name: "FB_LowerLip_000", id: 20623 },
    { name: "SKEL_R_Toe0", id: 20781 },
    { name: "FB_L_CheekBone_000", id: 21550 },
    { name: "MH_L_Elbow", id: 22711 },
    { name: "SKEL_Spine0", id: 23553 },
    { name: "RB_L_ThighRoll", id: 23639 },
    { name: "PH_R_Foot", id: 24806 },
    { name: "SKEL_Spine1", id: 24816 },
    { name: "SKEL_Spine2", id: 24817 },
    { name: "SKEL_Spine3", id: 24818 },
    { name: "FB_L_Eye_000", id: 25260 },
    { name: "SKEL_L_Finger00", id: 26610 },
    { name: "SKEL_L_Finger10", id: 26611 },
    { name: "SKEL_L_Finger20", id: 26612 },
    { name: "SKEL_L_Finger30", id: 26613 },
    { name: "SKEL_L_Finger40", id: 26614 },
    { name: "FB_R_Eye_000", id: 27474 },
    { name: "SKEL_R_Forearm", id: 28252 },
    { name: "PH_R_Hand", id: 28422 },
    { name: "FB_L_Lip_Corner_000", id: 29868 },
    { name: "SKEL_Head", id: 31086 },
    { name: "IK_R_Foot", id: 35502 },
    { name: "RB_Neck_1", id: 35731 },
    { name: "IK_L_Hand", id: 36029 },
    { name: "SKEL_R_Calf", id: 36864 },
    { name: "RB_R_ArmRoll", id: 37119 },
    { name: "FB_Brow_Centre_000", id: 37193 },
    { name: "SKEL_Neck_1", id: 39317 },
    { name: "SKEL_R_UpperArm", id: 40269 },
    { name: "FB_R_Lid_Upper_000", id: 43536 },
    { name: "RB_R_ForeArmRoll", id: 43810 },
    { name: "SKEL_L_UpperArm", id: 45509 },
    { name: "FB_L_Lid_Upper_000", id: 45750 },
    { name: "MH_L_Knee", id: 46078 },
    { name: "FB_Jaw_000", id: 46240 },
    { name: "FB_L_Lip_Bot_000", id: 47419 },
    { name: "FB_Tongue_000", id: 47495 },
    { name: "FB_R_Lip_Bot_000", id: 49979 },
    { name: "SKEL_R_Thigh", id: 51826 },
    { name: "SKEL_R_Foot", id: 52301 },
    { name: "IK_Root", id: 56604 },
    //{ name: "SKEL_R_Hand", id: 57005 },
    { name: "SKEL_Spine_Root", id: 57597 },
    { name: "PH_L_Foot", id: 57717 },
    { name: "SKEL_L_Thigh", id: 58271 },
    { name: "FB_L_Brow_Out_000", id: 58331 },
    { name: "SKEL_R_Finger00", id: 58866 },
    { name: "SKEL_R_Finger10", id: 58867 },
    { name: "SKEL_R_Finger20", id: 58868 },
    { name: "SKEL_R_Finger30", id: 58869 },
    { name: "SKEL_R_Finger40", id: 58870 },
    { name: "PH_L_Hand", id: 60309 },
    { name: "RB_L_ForeArmRoll", id: 61007 },
    { name: "SKEL_L_Forearm", id: 61163 },
    { name: "FB_UpperLip_000", id: 61839 },
    { name: "SKEL_L_Calf", id: 63931 },
    { name: "SKEL_R_Finger01", id: 64016 },
    { name: "SKEL_R_Finger02", id: 64017 },
    { name: "SKEL_R_Finger31", id: 64064 },
    { name: "SKEL_R_Finger32", id: 64065 },
    { name: "SKEL_R_Finger41", id: 64080 },
    { name: "SKEL_R_Finger42", id: 64081 },
    { name: "SKEL_R_Finger11", id: 64096 },
    { name: "SKEL_R_Finger12", id: 64097 },
    { name: "SKEL_R_Finger21", id: 64112 },
    { name: "SKEL_R_Finger22", id: 64113 },
    { name: "SKEL_L_Clavicle", id: 64729 },
    { name: "FACIAL_facialRoot", id: 65068 },
    { name: "IK_L_Foot", id: 65245 },
];