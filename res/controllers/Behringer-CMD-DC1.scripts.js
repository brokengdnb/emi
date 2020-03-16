function cmddc1 () {}
// Behringer CMD DC-1 Midi interface script for Mixxx Software
// Author  : Tiger <tiger@braineed.org> / Tiger #Mixxx@irc.freenode.net
// Version : 0.1.1

// Default channel of this device
// We substitute 1 because count starts from 0 (See MIDI specs)
cmddc1.defch = 6-1;

cmddc1.LEDCmd = 0x90; // Command Byte : Note On
cmddc1.LEDOff = 0x00; // LEDs can't be turned off, the Off status is LEDs to Orange/Amber color
cmddc1.LEDBlue = 0x01;
cmddc1.LEDBlueBlink = 0x02;

cmddc1.encLeft = 0x3F;
cmddc1.encRight = 0x41;

cmddc1.encLEDMid = 0x08;
cmddc1.encLEDOff = 0x00;
cmddc1.encLEDCnt = 16; // Ring of 15 LEDs -> 16 for round maths, special handling for max
cmddc1.encLEDUnit = 1/cmddc1.encLEDCnt;
cmddc1.encLEDCmd = 0xB0; // Command byte : Continuous Controller (CC)


cmddc1.FXCtrlCnt = 4;
cmddc1.FXCtrlStart = 0x14;

cmddc1.isShiftedA = false;
cmddc1.isShiftedB = false;
cmddc1.isShiftedC = false;
cmddc1.isShiftedD = false;

cmddc1.isPushedRotor = false;
cmddc1.isAutodjEnabled = false;

// Stores the physicals controls addresses with their affected effect parameters string
// Example : '[EffectRack1_EffectUnitX].super1': 0x14
cmddc1.FXControls = {};
cmddc1.FXControls2 = {};
cmddc1.FXControlsPadMain = {};

cmddc1.FXControlsCh1 = {};
cmddc1.FXControlsCh2 = {};
cmddc1.FXControlsCh3 = {};
cmddc1.FXControlsCh4 = {};


cmddc1.FXControlsPad5 = {};
cmddc1.FXControlsPad6 = {};
cmddc1.FXControlsPad7 = {};
cmddc1.FXControlsPad8 = {};
// Stores the physicals controls addresses with their affected special effects and parameters string


cmddc1.SFXControlsPadMain = {
    "0x10":"[Channel1].volume",
    "0x11":"[Channel2].volume",
    "0x12":"[Channel3].volume",
    "0x13":"[Channel4].volume",
    "0x14":"[QuickEffectRack1_[Channel1]].super1",
    "0x15":"[QuickEffectRack1_[Channel1]].mix",
    "0x16":"[QuickEffectRack1_[Channel2]].super1",
    "0x17":"[QuickEffectRack1_[Channel2]].mix"
};


cmddc1.SFXControlsCh1 = {
    "0x10":"[Channel1].volume",
    "0x11":"[Channel2].volume",
    "0x12":"[Channel3].volume",
    "0x13":"[Channel4].volume",
    "0x14":"[EqualizerRack1_[Channel1]_Effect1].parameter1",
    "0x15":"[EqualizerRack1_[Channel1]_Effect1].parameter2",
    "0x16":"[EqualizerRack1_[Channel1]_Effect1].parameter3",
    "0x17":"[Channel1].pregain"
};

cmddc1.SFXControlsCh2 = {
    "0x10":"[Channel1].volume",
    "0x11":"[Channel2].volume",
    "0x12":"[Channel3].volume",
    "0x13":"[Channel4].volume",
    "0x14":"[EqualizerRack1_[Channel2]_Effect1].parameter1",
    "0x15":"[EqualizerRack1_[Channel2]_Effect1].parameter2",
    "0x16":"[EqualizerRack1_[Channel2]_Effect1].parameter3",
    "0x17":"[Channel2].pregain"
};


cmddc1.SFXControlsCh3 = {
    "0x10":"[Channel1].volume",
    "0x11":"[Channel2].volume",
    "0x12":"[Channel3].volume",
    "0x13":"[Channel4].volume",
    "0x14":"[EqualizerRack1_[Channel3]_Effect1].parameter1",
    "0x15":"[EqualizerRack1_[Channel3]_Effect1].parameter2",
    "0x16":"[EqualizerRack1_[Channel3]_Effect1].parameter3",
    "0x17":"[Channel3].pregain"
};


cmddc1.SFXControlsCh4 = {
    "0x10":"[Channel1].volume",
    "0x11":"[Channel2].volume",
    "0x12":"[Channel3].volume",
    "0x13":"[Channel4].volume",
    "0x14":"[EqualizerRack1_[Channel4]_Effect1].parameter1",
    "0x15":"[EqualizerRack1_[Channel4]_Effect1].parameter2",
    "0x16":"[EqualizerRack1_[Channel4]_Effect1].parameter3",
    "0x17":"[Channel4].pregain"
};


cmddc1.SFXControlsPad5 = {
    "0x10":"[Sampler1].volume",
    "0x11":"[Sampler2].volume",
    "0x12":"[Sampler3].volume",
    "0x13":"[Sampler4].volume",
    "0x14":"[Sampler9].volume",
    "0x15":"[Sampler10].volume",
    "0x16":"[Sampler11].volume",
    "0x17":"[Sampler12].volume"
};

cmddc1.SFXControlsPad6 = {
    "0x10":"[Sampler5].volume",
    "0x11":"[Sampler6].volume",
    "0x12":"[Sampler7].volume",
    "0x13":"[Sampler8].volume",
    "0x14":"[Sampler13].volume",
    "0x15":"[Sampler14].volume",
    "0x16":"[Sampler15].volume",
    "0x17":"[Sampler16].volume"
};

cmddc1.SFXControlsPad7 = {
    "0x10":"[Sampler33].volume",
    "0x11":"[Sampler34].volume",
    "0x12":"[Sampler35].volume",
    "0x13":"[Sampler36].volume",
    "0x14":"[Sampler41].volume",
    "0x15":"[Sampler42].volume",
    "0x16":"[Sampler43].volume",
    "0x17":"[Sampler44].volume"
};

cmddc1.SFXControlsPad8 = {
    "0x10":"[Sampler37].volume",
    "0x11":"[Sampler38].volume",
    "0x12":"[Sampler39].volume",
    "0x13":"[Sampler40].volume",
    "0x14":"[Sampler45].volume",
    "0x15":"[Sampler46].volume",
    "0x16":"[Sampler47].volume",
    "0x17":"[Sampler48].volume"
};

cmddc1.SFXControls = {
    "0x10":"[Sampler1].volume",
    "0x11":"[Sampler2].volume",
    "0x12":"[Sampler3].volume",
    "0x13":"[Sampler4].volume"
};

cmddc1.SFXControls2 = {
    "0x14":"[Sampler9].volume",
    "0x15":"[Sampler10].volume",
    "0x16":"[Sampler11].volume",
    "0x17":"[Sampler12].volume"
};

// Decks count
cmddc1.deckCnt = 4;

cmddc1.launchPadNum = 0;


cmddc1.launchCh1Shifted = false;
cmddc1.launchCh2Shifted = false;
cmddc1.launchCh3Shifted = false;
cmddc1.launchCh4Shifted = false;

cmddc1.launchPadNum5Shifted = false;
cmddc1.launchPadNum6Shifted = false;
cmddc1.launchPadNum7Shifted = false;
cmddc1.launchPadNum8Shifted = false;

cmddc1.launchPadNumMainShifted = false;
// Stores the active cue mode
// 0 => Set cue ; 1 => Goto Cue ; -1 => Clear cue
cmddc1.cueMode = undefined;

// Cue mode physical control addresses
cmddc1.playCueCtrl = 0x15;
cmddc1.gotoCueCtrl = 0x16;
cmddc1.clearCueCtrl = 0x17;

// Stores the status of the decks
cmddc1.deckStatus = {};
// Decks physical controls addresses (used of LEDs initialization only)
cmddc1.deckControls = [ 0x00 , 0x03, 0x04, 0x07 ];

// Physical controls related to cues buttons
cmddc1.CUECnt = 16;
cmddc1.CUESStartCtrl = 0x24;
cmddc1.CUESStopCtrl = 0x33;

// Stores the physicals controls addresses of hotcues and their affected functions
// Example : '0x58': hotcue_5_set
cmddc1.CUESetControls = {};
cmddc1.CUEGotoControls = {};
cmddc1.CUEClearControls = {};





 function resetAll(group) {
    engine.setValue('[QuickEffectRack1_'+group+']', 'super1', 1);
    engine.setValue('[EqualizerRack1_'+group+'_Effect1]', 'parameter1', 1);
    engine.setValue('[EqualizerRack1_'+group+'_Effect1]', 'parameter2', 1);
    engine.setValue('[EqualizerRack1_'+group+'_Effect1]', 'parameter3', 1);
    engine.setValue(group, 'pregain');
}



/*
 * Initialize decks LEDs
 */
cmddc1.initDecksLEDs = function() {
    for(var i=0; i < cmddc1.deckCnt; i++ ) {
        midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, cmddc1.deckControls[i], cmddc1.LEDOff);
    }
};

/*
 * Initialize decks status for active mode
 */
cmddc1.initDecksStatus = function() {
    for(var i=1; i <= cmddc1.deckCnt; i++) {
        cmddc1.deckStatus[i] = false;
    }
    cmddc1.initDecksLEDs();
};

/*
 * Add/Set deck for cue mode
 */
cmddc1.enableDeck = function(channel, control, value, status, group) {
    var deck = group.substring( (group.length - 2), (group.length - 1));
    
    cmddc1.deckStatus[deck] ^= true;
    
    midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd,
                      control,
                      (cmddc1.deckStatus[deck] == true ? cmddc1.LEDBlueBlink : cmddc1.LEDOff)
         );
};

/*
 * Affect the hotcues to their respective physical control addresses
 */
cmddc1.initCUEControls = function() {
    /*var cuectrl = cmddc1.CUESStartCtrl;
    
    for(var i=1; i <= cmddc1.CUECnt; i++) {
        cmddc1.CUESetControls[cuectrl] = "hotcue_"+i+"_set";
        cmddc1.CUEGotoControls[cuectrl] = "hotcue_"+i+"_goto";
        cmddc1.CUEClearControls[cuectrl] = "hotcue_"+i+"_clear";
        cuectrl++;
    } */
};

/*
 * 
 */
cmddc1.initCueMode = function() {
    midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, cmddc1.playCueCtrl, cmddc1.LEDOff);
    midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, cmddc1.gotoCueCtrl, cmddc1.LEDOff);
    midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, cmddc1.clearCueCtrl, cmddc1.LEDOff);
    cmddc1.cueMode = undefined;
}

/*
 * 
 */
cmddc1.cueMode = function(channel, control, value, status, group) {
    /*
    cmddc1.initCueMode();
    
    switch(control) {
        case cmddc1.playCueCtrl:
            cmddc1.cueMode = "play";
            break;
        case cmddc1.gotoCueCtrl:
            cmddc1.cueMode = "goto";
            break;
        case cmddc1.clearCueCtrl:
            cmddc1.cueMode = "clear";
            break;
        default:
            cmddc1.cueMode = undefined;
            break;
    }
    
    if(cmddc1.cueMode !== undefined) {
        midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, control, cmddc1.LEDBlueBlink);
    }
 */
};

/*
 * Set/Clear/Goto the cues on selected decks and under mode "Focus"
 */
cmddc1.setCues = function(channel, control, value, status, group) {
    /*if(cmddc1.cueMode !== undefined) {
        var changrp="[Channel";
        
        for(var i=1; i <= cmddc1.deckCnt; i++) {
            if(cmddc1.deckStatus[i] == true) {
                switch(cmddc1.cueMode) {
                    case "play":
                        engine.setValue(changrp+i+"]", cmddc1.CUESetControls[control], value);
                        break;
                    case "goto":
                        engine.setValue(changrp+i+"]", cmddc1.CUEGotoControls[control], value);
                        break;
                    case "clear":
                        engine.setValue(changrp+i+"]", cmddc1.CUEClearControls[control], value);
                        break;
                    default:
                        break;
                }
            }
        }
    } */
};

/*
 * Turn to default color (orange) all LEDs and turn Off all encoders LEDs rings
 */
cmddc1.initLEDs = function() {
    // Turn into orange all buttons LEDs
    for(var i=0x00; i <= 0x33; i++)
        midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, i, cmddc1.LEDOff);
    
    // Turn off all encoders ring of LEDs 
    for(var i=0x10; i <= 0x17; i++)
        midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd, i, cmddc1.encLEDOff);
};

	engine.setValue("[SamplerModule17]", "show", 0);
	engine.setValue("[SamplerModule18]", "show", 0);
	engine.setValue("[SamplerModule19]", "show", 0);
	engine.setValue("[SamplerModule20]", "show", 0);

	engine.setValue("[SamplerModule25]", "show", 0);
	engine.setValue("[SamplerModule26]", "show", 0);
	engine.setValue("[SamplerModule27]", "show", 0);
	engine.setValue("[SamplerModule28]", "show", 0);


cmddc1.viewSampler1 = function(light) {
	engine.setValue("[SamplerModule1]", "show", light);
	engine.setValue("[SamplerModule2]", "show", light);	
	engine.setValue("[SamplerModule3]", "show", light);
	engine.setValue("[SamplerModule4]", "show", light);

	engine.setValue("[SamplerModule9]", "show", light);
	engine.setValue("[SamplerModule10]", "show", light);
	engine.setValue("[SamplerModule11]", "show", light);
	engine.setValue("[SamplerModule12]", "show", light);

	//engine.setValue("[SamplerModule17]", "show", light);
	//engine.setValue("[SamplerModule18]", "show", light);
	//engine.setValue("[SamplerModule19]", "show", light);
	//engine.setValue("[SamplerModule20]", "show", light);

	//engine.setValue("[SamplerModule25]", "show", light);
	//engine.setValue("[SamplerModule26]", "show", light);
	//engine.setValue("[SamplerModule27]", "show", light);
	//engine.setValue("[SamplerModule28]", "show", light);
}

cmddc1.viewSampler2 = function(light) {
	engine.setValue("[SamplerModule5]", "show", light);
	engine.setValue("[SamplerModule6]", "show", light);	
	engine.setValue("[SamplerModule7]", "show", light);
	engine.setValue("[SamplerModule8]", "show", light);

	engine.setValue("[SamplerModule13]", "show", light);
	engine.setValue("[SamplerModule14]", "show", light);
	engine.setValue("[SamplerModule15]", "show", light);
	engine.setValue("[SamplerModule16]", "show", light);

	//engine.setValue("[SamplerModule21]", "show", light);
	//engine.setValue("[SamplerModule22]", "show", light);
	//engine.setValue("[SamplerModule23]", "show", light);
	//engine.setValue("[SamplerModule24]", "show", light);

	//engine.setValue("[SamplerModule29]", "show", light);
	//engine.setValue("[SamplerModule30]", "show", light);
	//engine.setValue("[SamplerModule31]", "show", light);
	//engine.setValue("[SamplerModule32]", "show", light);
}

cmddc1.viewSampler3 = function(light) {


	engine.setValue("[SamplerModule33]", "show", light);
	engine.setValue("[SamplerModule34]", "show", light);
	engine.setValue("[SamplerModule35]", "show", light);
	engine.setValue("[SamplerModule36]", "show", light);

	engine.setValue("[SamplerModule41]", "show", light);
	engine.setValue("[SamplerModule42]", "show", light);
	engine.setValue("[SamplerModule43]", "show", light);
	engine.setValue("[SamplerModule44]", "show", light);

	//engine.setValue("[SamplerModule49]", "show", light);
	//engine.setValue("[SamplerModule50]", "show", light);
	//engine.setValue("[SamplerModule51]", "show", light);
	//engine.setValue("[SamplerModule52]", "show", light);

	//engine.setValue("[SamplerModule57]", "show", light);
	//engine.setValue("[SamplerModule58]", "show", light);
	//engine.setValue("[SamplerModule59]", "show", light);
	//engine.setValue("[SamplerModule60]", "show", light);
}

cmddc1.viewSampler4 = function(light) {


	engine.setValue("[SamplerModule37]", "show", light);
	engine.setValue("[SamplerModule38]", "show", light);
	engine.setValue("[SamplerModule39]", "show", light);
	engine.setValue("[SamplerModule40]", "show", light);

	engine.setValue("[SamplerModule45]", "show", light);
	engine.setValue("[SamplerModule46]", "show", light);
	engine.setValue("[SamplerModule47]", "show", light);
	engine.setValue("[SamplerModule48]", "show", light);

	//engine.setValue("[SamplerModule53]", "show", light);
	//engine.setValue("[SamplerModule54]", "show", light);
	//engine.setValue("[SamplerModule55]", "show", light);
	//engine.setValue("[SamplerModule56]", "show", light);

	//engine.setValue("[SamplerModule61]", "show", light);
	//engine.setValue("[SamplerModule62]", "show", light);
	//engine.setValue("[SamplerModule63]", "show", light);
	//engine.setValue("[SamplerModule64]", "show", light);
}


cmddc1.launchPadNum5 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 5;
	cmddc1.launchPadNum5Shifted = true;
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);

	cmddc1.viewSampler2(0);
	cmddc1.viewSampler3(0);
	cmddc1.viewSampler4(0);
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDBlue);
	cmddc1.launchPadNum5Shifted = false;
	cmddc1.viewSampler1(1);
	

		cmddc1.connectSFXEncodersPad5()

    }
}

cmddc1.launchPadNumMain = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 0;
	cmddc1.launchPadNumMainShifted = true;

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);

	cmddc1.viewSampler1(0);
	cmddc1.viewSampler2(0);
	cmddc1.viewSampler3(0);
	cmddc1.viewSampler4(0);
	
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDBlue);

	cmddc1.launchPadNumMainShifted = false;
	cmddc1.connectSFXEncodersPadMain();	

	}
}

cmddc1.launchCh1 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 1;
	cmddc1.launchCh1Shifted = true;

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);

	cmddc1.viewSampler1(0);
	cmddc1.viewSampler2(0);
	cmddc1.viewSampler3(0);
	cmddc1.viewSampler4(0);
	
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDBlue);

	cmddc1.launchCh1Shifted = false;
	cmddc1.connectSFXEncodersCh1();	

	}
}


cmddc1.launchCh2 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 2;
	cmddc1.launchCh2Shifted = true;

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);

	cmddc1.viewSampler1(0);
	cmddc1.viewSampler2(0);
	cmddc1.viewSampler3(0);
	cmddc1.viewSampler4(0);
	
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDBlue);

	cmddc1.launchCh2Shifted = false;
	cmddc1.connectSFXEncodersCh2();	

	}
}


cmddc1.launchCh3 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 3;
	cmddc1.launchCh3Shifted = true;

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);

	cmddc1.viewSampler1(0);
	cmddc1.viewSampler2(0);
	cmddc1.viewSampler3(0);
	cmddc1.viewSampler4(0);
	
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDBlue);

	cmddc1.launchCh3Shifted = false;
	cmddc1.connectSFXEncodersCh3();	

	}
}

cmddc1.launchCh4 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 4;
	cmddc1.launchCh4Shifted = true;

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);

	cmddc1.viewSampler1(0);
	cmddc1.viewSampler2(0);
	cmddc1.viewSampler3(0);
	cmddc1.viewSampler4(0);
	
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDBlue);

	cmddc1.launchCh4Shifted = false;
	cmddc1.connectSFXEncodersCh4();	

	}
}




cmddc1.launchPadNum6 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 6;
	cmddc1.launchPadNum6Shifted = true;

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);

	cmddc1.viewSampler1(0);
	
	cmddc1.viewSampler3(0);
	cmddc1.viewSampler4(0);
	
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDBlue);

	cmddc1.launchPadNum2Shifted = false;
	cmddc1.connectSFXEncodersPad6();	
	cmddc1.viewSampler2(1);
}
}

cmddc1.launchPadNum7 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 7;
	cmddc1.launchPadNum7Shifted = true;

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDOff);


	cmddc1.viewSampler1(0);
	cmddc1.viewSampler2(0);
	cmddc1.viewSampler4(0);
    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDBlue);
	cmddc1.viewSampler3(1);
	cmddc1.connectSFXEncodersPad7()
	cmddc1.launchPadNum7Shifted = false;
    }
}

cmddc1.launchPadNum8 = function(channel, control, value, status, group) {
    if (value === 127) {
	cmddc1.launchPadNum = 8;
	cmddc1.launchPadNum8Shifted = true;
	

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);

	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x10, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x11, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x12, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x13, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x14, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x15, cmddc1.LEDOff);
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x16, cmddc1.LEDOff);

	
	cmddc1.viewSampler1(0);
	cmddc1.viewSampler2(0);
	cmddc1.viewSampler3(0);

    } else {
	midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x17, cmddc1.LEDBlue);
	cmddc1.launchPadNum8Shifted = false;
	cmddc1.connectSFXEncodersPad8()
	cmddc1.viewSampler4(1);
    }
}

cmddc1.pad2 = function(channel, control, value, status, group) {
    if (value === 127) {
            if(cmddc1.launchPadNum === 1) {
                if(cmddc1.launchCh1Shifted) {
                    engine.setValue("[Channel1]", "volume", 0);
                    engine.setValue("[Channel1]", "play", 0);
                    engine.setValue("[Channel1]", "eject", 1);
                    resetAll(group);
                } else {
                    engine.setValue("[Channel1]", "LoadSelectedTrack", 1);
                }
            } else if(cmddc1.launchPadNum === 2) {
                if(cmddc1.launchCh2Shifted) {
                    engine.setValue("[Channel2]", "volume", 0);
                    engine.setValue("[Channel2]", "play", 0);
                    engine.setValue("[Channel2]", "eject", 1);
                    resetAll(group);
                } else {
                    engine.setValue("[Channel2]", "LoadSelectedTrack", 1);
                }
            } else if(cmddc1.launchPadNum === 3) {
                if(cmddc1.launchCh3Shifted) {
                    engine.setValue("[Channel3]", "volume", 0);
                    engine.setValue("[Channel3]", "play", 0);
                    engine.setValue("[Channel3]", "eject", 1);
                    resetAll(group);
                } else {
                    engine.setValue("[Channel3]", "LoadSelectedTrack", 1);
                }
            } else if(cmddc1.launchPadNum === 4) {
                if(cmddc1.launchCh4Shifted) {
                    engine.setValue("[Channel4]", "volume", 0);
                    engine.setValue("[Channel4]", "play", 0);
                    engine.setValue("[Channel4]", "eject", 1);
                    resetAll(group);
                } else {
                    engine.setValue("[Channel4]", "LoadSelectedTrack", 1);
                }
            } 

            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x25, cmddc1.LEDBlue);
    } else {
            if(cmddc1.launchPadNum === 1) {
                engine.setValue("[Channel1]", "play", 1);
            } else if(cmddc1.launchPadNum === 2) {
                engine.setValue("[Channel2]", "play", 1);
            } else if(cmddc1.launchPadNum === 3) {
                engine.setValue("[Channel3]", "play", 1);
            } else if(cmddc1.launchPadNum === 4) {
                engine.setValue("[Channel4]", "play", 1);
            } 

            engine.setValue("[Channel1]", "eject", 0);
            engine.setValue("[Channel2]", "eject", 0);
            engine.setValue("[Channel3]", "eject", 0);
            engine.setValue("[Channel4]", "eject", 0);


            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x25, cmddc1.LEDOff);
    }
}

cmddc1.pad5 = function(channel, control, value, status, group) {
    if (value === 127) {
        if(cmddc1.launchPadNum === 1) {
                engine.setValue("[Channel1]", "beatjump", -4);
                midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x28, cmddc1.LEDBlue);

            } else if(cmddc1.launchPadNum === 2) {
                engine.setValue("[Channel2]", "beatjump", -4);
                midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x28, cmddc1.LEDBlue);

            } else if(cmddc1.launchPadNum === 3) {
                engine.setValue("[Channel3]", "beatjump", -4);
                midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x28, cmddc1.LEDBlue);

            } else if(cmddc1.launchPadNum === 4) {
                engine.setValue("[Channel4]", "beatjump", -4);
                midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x28, cmddc1.LEDBlue);

            } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
            engine.setValue("[Sampler9]", "LoadSelectedTrack", 1);
        } 
    } else {
        if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x28, cmddc1.LEDOff);
        }    
    }
}

cmddc1.pad6 = function(channel, control, value, status, group) {
    if(value === 127) {
        if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", -8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x29, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", -8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x29, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", -8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x29, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", -8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x29, cmddc1.LEDBlue);

        }
    } else {
        if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x29, cmddc1.LEDOff);
        }    
    }
}

cmddc1.pad7 = function(channel, control, value, status, group) {
    if (value === 127) {
        if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", 4);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2A, cmddc1.LEDBlue);
        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", 4);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2A, cmddc1.LEDBlue);
        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", 4);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2A, cmddc1.LEDBlue);
        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", 4);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2A, cmddc1.LEDBlue);
        } 
    } else {
        if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2A, cmddc1.LEDOff);
        }   
    }
}

cmddc1.pad8 = function(channel, control, value, status, group) {
    if (value === 127) {
        if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", 8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2B, cmddc1.LEDBlue);
        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", 8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2B, cmddc1.LEDBlue);
        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", 8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2B, cmddc1.LEDBlue);
        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", 8);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2B, cmddc1.LEDBlue);
        } 
    } else {
        if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2B, cmddc1.LEDOff);
        }   
    }
}


cmddc1.pad9 = function(channel, control, value, status, group) {
    if (value === 127) {
	if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", -16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", -16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", -16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", -16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
		engine.setValue("[Sampler9]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
		engine.setValue("[Sampler13]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
		engine.setValue("[Sampler41]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
		engine.setValue("[Sampler45]", "LoadSelectedTrack", 1);
	} else if (cmddc1.launchPadNum === 5) {
		engine.setValue("[Sampler9]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 6) {
		engine.setValue("[Sampler13]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 7) {
		engine.setValue("[Sampler41]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 8) {
		engine.setValue("[Sampler45]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDBlue);
	};
    } else {
	if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDOff);
        } else if(!cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
		//engine.setValue("[Sampler9]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
		//engine.setValue("[Sampler13]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
		//engine.setValue("[Sampler41]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
		//engine.setValue("[Sampler45]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2C, cmddc1.LEDOff);
	};		
    }
}

cmddc1.pad10 = function(channel, control, value, status, group) {
    if (value === 127) {
	if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", -32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", -32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", -32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", -32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
		engine.setValue("[Sampler10]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 2)) {
		engine.setValue("[Sampler14]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 3)) {
		engine.setValue("[Sampler42]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 4)) {
		engine.setValue("[Sampler46]", "LoadSelectedTrack", 1);
	} else if (cmddc1.launchPadNum === 5) {
		engine.setValue("[Sampler10]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 6) {
		engine.setValue("[Sampler14]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 7) {
		engine.setValue("[Sampler42]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 8) {
		engine.setValue("[Sampler46]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDBlue);
	};
    } else {
	if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDOff);
        } else if(!cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
		//engine.setValue("[Sampler10]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
		//engine.setValue("[Sampler14]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
		//engine.setValue("[Sampler42]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
		//engine.setValue("[Sampler46]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2D, cmddc1.LEDOff);
	};		
    }
}


cmddc1.pad11 = function(channel, control, value, status, group) {
    if (value === 127) {
	   if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", 16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", 16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", 16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", 16);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
    		engine.setValue("[Sampler11]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
    		engine.setValue("[Sampler15]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
    		engine.setValue("[Sampler43]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
    		engine.setValue("[Sampler47]", "LoadSelectedTrack", 1);
    	} else if (cmddc1.launchPadNum === 5) {
    		engine.setValue("[Sampler11]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 6) {
    		engine.setValue("[Sampler15]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 7) {
    		engine.setValue("[Sampler43]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 8) {
    		engine.setValue("[Sampler47]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDBlue);
    	};
    } else {
	if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDOff);
        } else if(!cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
		//engine.setValue("[Sampler11]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
		//engine.setValue("[Sampler15]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
		//engine.setValue("[Sampler43]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
		//engine.setValue("[Sampler47]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2E, cmddc1.LEDOff);
	};		
    }
}

cmddc1.pad12 = function(channel, control, value, status, group) {
    if (value === 127) {
    	if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", 32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", 32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", 32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", 32);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
    		engine.setValue("[Sampler12]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
    		engine.setValue("[Sampler16]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
    		engine.setValue("[Sampler44]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
    		engine.setValue("[Sampler48]", "LoadSelectedTrack", 1);
    	} else if (cmddc1.launchPadNum === 5) {
    		engine.setValue("[Sampler12]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 6) {
    		engine.setValue("[Sampler16]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 7) {
    		engine.setValue("[Sampler44]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 8) {
    		engine.setValue("[Sampler48]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDBlue);
    	};
    } else {
	   if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDOff);
        } else if(!cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
    		//engine.setValue("[Sampler12]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDOff);
    	} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
    		//engine.setValue("[Sampler16]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDOff);
    	} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
    		//engine.setValue("[Sampler44]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDOff);
    	} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
    		//engine.setValue("[Sampler48]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x2F, cmddc1.LEDOff);
    	};		
    }
}

cmddc1.pad13 = function(channel, control, value, status, group) {
    if (value === 127) {
		
        if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", -64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", -64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", -64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", -64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
			engine.setValue("[Sampler1]", "LoadSelectedTrack", 1);
		} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
			engine.setValue("[Sampler5]", "LoadSelectedTrack", 1);
		} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
			engine.setValue("[Sampler33]", "LoadSelectedTrack", 1);
		} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
			engine.setValue("[Sampler37]", "LoadSelectedTrack", 1);
		} else if (cmddc1.launchPadNum === 5) {
			engine.setValue("[Sampler1]", "start_play", 1);
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);
		} else if (cmddc1.launchPadNum === 6) {
			engine.setValue("[Sampler5]", "start_play", 1);
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);
		} else if (cmddc1.launchPadNum === 7) {
			engine.setValue("[Sampler33]", "start_play", 1);
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);
		} else if (cmddc1.launchPadNum === 8) {
			engine.setValue("[Sampler37]", "start_play", 1);
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDBlue);
		}
    } else {
		if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDOff);
        } else if(!cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
			//engine.setValue("[Sampler1]", "start_stop", 1);	
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDOff);
		} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
			//engine.setValue("[Sampler5]", "start_stop", 1);	
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDOff);
		} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
			//engine.setValue("[Sampler33]", "start_stop", 1);	
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDOff);
		} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
			//engine.setValue("[Sampler37]", "start_stop", 1);	
			midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x30, cmddc1.LEDOff);
		}
    }
}

cmddc1.pad14 = function(channel, control, value, status, group) {
    if (value === 127) {
	
    if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", -128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", -128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", -128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", -128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);
    } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
		engine.setValue("[Sampler2]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
		engine.setValue("[Sampler6]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
		engine.setValue("[Sampler34]", "LoadSelectedTrack", 1);
	} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
		engine.setValue("[Sampler38]", "LoadSelectedTrack", 1);
	} else if (cmddc1.launchPadNum === 5) {
		engine.setValue("[Sampler2]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 6) {
		engine.setValue("[Sampler6]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 7) {
		engine.setValue("[Sampler34]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);
	} else if (cmddc1.launchPadNum === 8) {
		engine.setValue("[Sampler38]", "start_play", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDBlue);
	};
    } else {
	if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDOff);
        } else if(!cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
		//engine.setValue("[Sampler2]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
		//engine.setValue("[Sampler6]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
		//engine.setValue("[Sampler34]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDOff);
	} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
		//engine.setValue("[Sampler38]", "start_stop", 1);	
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x31, cmddc1.LEDOff);
	};		
    }
}

cmddc1.pad15 = function(channel, control, value, status, group) {
	var light = false;

    if (value === 127) {
    	if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", 64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", 64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", 64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", 64);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
    		engine.setValue("[Sampler3]", "LoadSelectedTrack", 1);
    		
    		if(engine.getValue("[Sampler3]", "play") === 1) {
    			print("asfdasdasdasdasdasd");
    			if(cmddc1.isShiftedB) {
    				engine.setValue("[Sampler3]", "play", 0);
    			} else if(engine.getValue("[Sampler3]", "repeat") === 0){
    				engine.setValue("[Sampler3]", "repeat", 1);
    			} else {
    				engine.setValue("[Sampler3]", "repeat", 0);
    			}
    		}
    	} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
    		engine.setValue("[Sampler7]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
    		engine.setValue("[Sampler35]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
    		engine.setValue("[Sampler39]", "LoadSelectedTrack", 1);
    	} else if (cmddc1.launchPadNum === 5) {
    		engine.setValue("[Sampler3]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 6) {
    		engine.setValue("[Sampler7]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 7) {
    		engine.setValue("[Sampler35]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 8) {
    		engine.setValue("[Sampler39]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);
    	};
    } else {
		if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDOff);
        } else if(cmddc1.launchPadNum === 5) {
			//engine.setValue("[Sampler3]", "start_stop", 1);	
			if(engine.getValue("[Sampler3]", "repeat") === 0){
					midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDOff);
				} else {
					midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDBlue);
				}

		} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
			//engine.setValue("[Sampler7]", "start_stop", 1);	
			if(!light) midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDOff);
		} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
			//engine.setValue("[Sampler35]", "start_stop", 1);	
			if(!light) midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDOff);
		} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
			//engine.setValue("[Sampler39]", "start_stop", 1);	
			if(!light) midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x32, cmddc1.LEDOff);
		};		
    }
}

cmddc1.pad16 = function(channel, control, value, status, group) {
    if (value === 127) {
    	if(cmddc1.launchPadNum === 1) {
            engine.setValue("[Channel1]", "beatjump", 128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 2) {
            engine.setValue("[Channel2]", "beatjump", 128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 3) {
            engine.setValue("[Channel3]", "beatjump", 128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);

        } else if(cmddc1.launchPadNum === 4) {
            engine.setValue("[Channel4]", "beatjump", 128);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);
    } else if(cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
    		engine.setValue("[Sampler4]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
    		engine.setValue("[Sampler8]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
    		engine.setValue("[Sampler36]", "LoadSelectedTrack", 1);
    	} else if(cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
    		engine.setValue("[Sampler40]", "LoadSelectedTrack", 1);
    	} else if (cmddc1.launchPadNum === 5) {
    		engine.setValue("[Sampler4]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 6) {
    		engine.setValue("[Sampler8]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 7) {
    		engine.setValue("[Sampler36]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);
    	} else if (cmddc1.launchPadNum === 8) {
    		engine.setValue("[Sampler40]", "start_play", 1);
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDBlue);
    	};
    } else {
    	if(cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 || cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4) {
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDOff);
        } else if(!cmddc1.launchPadNum5Shifted && (cmddc1.launchPadNum === 5)) {
    		//engine.setValue("[Sampler4]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDOff);
    	} else if(!cmddc1.launchPadNum6Shifted && (cmddc1.launchPadNum === 6)) {
    		//engine.setValue("[Sampler8]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDOff);
    	} else if(!cmddc1.launchPadNum7Shifted && (cmddc1.launchPadNum === 7)) {
    		//engine.setValue("[Sampler36]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDOff);
    	} else if(!cmddc1.launchPadNum8Shifted && (cmddc1.launchPadNum === 8)) {
    		//engine.setValue("[Sampler40]", "start_stop", 1);	
    		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x33, cmddc1.LEDOff);
    	};		
    }
}

cmddc1.SelectTrackKnob = function(channel, control, value, status, group) {
    if (value === 127) {
        //push 
        if(cmddc1.isShiftedA){
            engine.setValue("[Playlist]", "ToggleSelectedSidebarItem", 1);
        } else if(cmddc1.isShiftedD) {
            cmddc1.isPushedRotor = true;
        } else {
            engine.setValue("[Playlist]", "LoadSelectedIntoFirstStopped", 1);
        }
    
    } else if(value === 65) {
        //right
        
        if(cmddc1.isShiftedA){
            engine.setValue("[Playlist]", "SelectPlaylist", 1);
        } else if(cmddc1.isPushedRotor){
            engine.setValue("[Library]", "MoveVertical", 100);
        } else if(cmddc1.isShiftedD) {
             engine.setValue("[Library]", "MoveVertical", 10);
        } else  {
            engine.setValue("[Library]", "MoveVertical", 1);
        }
    } else if(value === 63) {
        //left
        
        if(cmddc1.isShiftedA){
            engine.setValue("[Playlist]", "SelectPlaylist", -1);
        } else if(cmddc1.isPushedRotor) {
            engine.setValue("[Library]", "MoveVertical", -100);
        } else if(cmddc1.isShiftedD) {
             engine.setValue("[Library]", "MoveVertical", -10);
        } else {
            engine.setValue("[Library]", "MoveVertical", -1);
        }
    } else {

    }
}

/*
 * Encoders handle for effect parameters
 */
cmddc1.encoderFXParam1 = function(channel, control, value, status, group) {
    // Get the parameter and its number
    var param = group.split(".");

    if(cmddc1.launchPadNum === 0 || cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 ||cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4 ) {
		var fxreal = engine.getParameter("[Channel1]", "volume");

	    if(value == cmddc1.encRight) {
			fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel1]", "volume", fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
			fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel1]", "volume", fxreal);
	    }
	} else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler1]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler1]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler1]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler5]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler5]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler5]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler33]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler33]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler33]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler37]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler37]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler37]", param[1], fxreal);
	    }
	} 
};

cmddc1.encoderFXParam2 = function(channel, control, value, status, group) {
    // Get the parameter and its number
    var param = group.split(".");
	if(cmddc1.launchPadNum === 0 || cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 ||cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4 ) {
		var fxreal = engine.getParameter("[Channel2]", "volume");

	    if(value == cmddc1.encRight) {
			fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel2]", "volume", fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
			fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel2]", "volume", fxreal);
	    }
	} else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler2]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler2]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler2]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler6]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler6]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler6]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler34]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler34]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler34]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler38]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler38]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler38]", param[1], fxreal);
	    }
	} 
};


cmddc1.encoderFXParam3 = function(channel, control, value, status, group) {
    // Get the parameter and its number
    var param = group.split(".");
	if(cmddc1.launchPadNum === 0 || cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 ||cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4 ) {
		var fxreal = engine.getParameter("[Channel3]", "volume");

	    if(value == cmddc1.encRight) {
			fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel3]", "volume", fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
			fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel3]", "volume", fxreal);
	    }
	} else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler3]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler3]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler3]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler7]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler7]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler7]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler35]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler35]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler35]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler39]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler39]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler39]", param[1], fxreal);
	    }
	} 
};


cmddc1.encoderFXParam4 = function(channel, control, value, status, group) {
    // Get the parameter and its number
    var param = group.split(".");
	if(cmddc1.launchPadNum === 0 || cmddc1.launchPadNum === 1 || cmddc1.launchPadNum === 2 ||cmddc1.launchPadNum === 3 || cmddc1.launchPadNum === 4 ) {
		var fxreal = engine.getParameter("[Channel4]", "volume");

	    if(value == cmddc1.encRight) {
			fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel4]", "volume", fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
			fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
			engine.setParameter("[Channel4]", "volume", fxreal);
	    }
	} else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler4]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler4]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler4]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler8]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler8]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler8]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler36]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler36]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler36]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler40]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler40]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler40]", param[1], fxreal);
	    }
	} 
};


cmddc1.encoderFXParam5 = function(channel, control, value, status, group) {
    // Get the parameter and its number
    var param = group.split(".");
	if(cmddc1.launchPadNum === 1) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter1");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter1", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter1", fxreal);
        }
    } else if(cmddc1.launchPadNum === 2) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter1");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter1", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter1", fxreal);
        }
    } else if(cmddc1.launchPadNum === 3) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter1");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter1", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter1", fxreal);
        }
    } else if(cmddc1.launchPadNum === 4) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter1");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter1", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter1", fxreal);
        }
    } else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler9]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler9]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler9]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler13]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler13]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler13]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler41]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler41]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler41]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler45]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler45]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler45]", param[1], fxreal);
	    }
	} 
};

cmddc1.encoderFXParam6 = function(channel, control, value, status, group) {
    // Get the parameter and its number
    var param = group.split(".");


	if(cmddc1.launchPadNum === 1) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter2");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter2", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter2", fxreal);
        }
    } else if(cmddc1.launchPadNum === 2) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter2");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter2", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter2", fxreal);
        }
    } else if(cmddc1.launchPadNum === 3) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter2");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter2", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter2", fxreal);
        }
    } else if(cmddc1.launchPadNum === 4) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter2");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter2", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter2", fxreal);
        }
    } else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler10]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler10]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler10]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler14]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler14]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler14]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler42]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler42]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler42]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler46]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler46]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler46]", param[1], fxreal);
	    }
	} 
};


cmddc1.encoderFXParam7 = function(channel, control, value, status, group) {
    // Get the parameter and its number
    var param = group.split(".");
	if(cmddc1.launchPadNum === 1) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter3");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter3", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel1]_Effect1]", "parameter3", fxreal);
        }
    } else if(cmddc1.launchPadNum === 2) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter3");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter3", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel2]_Effect1]", "parameter3", fxreal);
        }
    } else if(cmddc1.launchPadNum === 3) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter3");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter3", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel3]_Effect1]", "parameter3", fxreal);
        }
    } else if(cmddc1.launchPadNum === 4) {
        var fxreal = engine.getParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter3");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter3", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[EqualizerRack1_[Channel4]_Effect1]", "parameter3", fxreal);
        }
    } else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler11]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler11]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler11]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler15]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler15]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler15]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler43]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler43]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler43]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler47]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler47]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler47]", param[1], fxreal);
	    }
	} 
};




cmddc1.encoderFXParam8 = function(channel, control, value, status, group) {




    // Get the parameter and its number
    var param = group.split(".");
	if(cmddc1.launchPadNum === 1) {
        var fxreal = engine.getParameter("[Channel1]", "pregain");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel1]", "pregain", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel1]", "pregain", fxreal);
        }
    } else if(cmddc1.launchPadNum === 2) {
        var fxreal = engine.getParameter("[Channel2]", "pregain");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel2]", "pregain", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel2]", "pregain", fxreal);
        }
    } else if(cmddc1.launchPadNum === 3) {
        var fxreal = engine.getParameter("[Channel3]", "pregain");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel3]", "pregain", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel3]", "pregain", fxreal);
        }
    } else if(cmddc1.launchPadNum === 4) {
        var fxreal = engine.getParameter("[Channel4]", "pregain");

        print(fxreal);

        if(value == cmddc1.encRight) {
        fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel4]", "pregain", fxreal);
        }
        
        // Decrement the effect parameter value
        if(value == cmddc1.encLeft) {
        fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
        engine.setParameter("[Channel4]", "pregain", fxreal);
        }
    } else if(cmddc1.launchPadNum === 5) {
		var fxreal = engine.getParameter("[Sampler12]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler12]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler12]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 6) {
		var fxreal = engine.getParameter("[Sampler16]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler16]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler16]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 7) {
		var fxreal = engine.getParameter("[Sampler44]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler44]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler44]", param[1], fxreal);
	    }
	} else if(cmddc1.launchPadNum === 8) {
		var fxreal = engine.getParameter("[Sampler48]", param[1]);

		print(fxreal);

	    if(value == cmddc1.encRight) {
		fxreal += (fxreal == 1 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler48]", param[1], fxreal);
	    }
	    
	    // Decrement the effect parameter value
	    if(value == cmddc1.encLeft) {
		fxreal -= (fxreal == 0 ? 0 : cmddc1.encLEDUnit);
		engine.setParameter("[Sampler48]", param[1], fxreal);
	    }
	} 
};



cmddc1.enableAutoDJ = function(channel, control, value, status, group) {
	if(cmddc1.isAutodjEnabled) {
		cmddc1.isAutodjEnabled = false;
		engine.setValue("[AutoDJ]", "enabled", 0);
		engine.setValue("[autoDJRow]", "show", 0);
		engine.setValue("[SmallDeck3]", "show", 1);
		engine.setValue("[SmallDeck4]", "show", 1);
		engine.setValue("[Deck3]", "show", 1);
		engine.setValue("[Deck4]", "show", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x00, cmddc1.LEDOff);
	} else {
		cmddc1.isAutodjEnabled = true;
		
		engine.setValue("[autoDJRow]", "show", 1);
		engine.setValue("[AutoDJ]", "enabled", 1);
		engine.setValue("[SmallDeck3]", "show", 0);
		engine.setValue("[SmallDeck4]", "show", 0);
		engine.setValue("[Deck3]", "show", 0);
		engine.setValue("[Deck4]", "show", 0);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x00, cmddc1.LEDBlue);
	}
}


cmddc1.shuffleAutoDJ = function(channel, control, value, status, group) {
	if(value){
		engine.setValue("[AutoDJ]", "shuffle_playlist", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDBlue);
	} else {
		//cmddc1.isAutodjShuffled = false;
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x04, cmddc1.LEDOff);
	}
}

cmddc1.addToTopAutoDJ = function(channel, control, value, status, group) {
	if(value && cmddc1.isShiftedB) {
		engine.setValue("[AutoDJ]", "skip_next", 1);
		engine.setValue("[AutoDJ]", "enabled", 0);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x03, cmddc1.LEDBlue);
		engine.setValue("[AutoDJ]", "enabled", 1);
	} else if(value){
		engine.setValue("[Library]", "AutoDjAddTop", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x03, cmddc1.LEDBlue);
	} else {
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x03, cmddc1.LEDOff);
	}
}

cmddc1.addToBottomAutoDJ = function(channel, control, value, status, group) {
	if(value && cmddc1.isShiftedB) {
		engine.setValue("[AutoDJ]", "fade_now", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x07, cmddc1.LEDBlue);
	} else if(value) {
		engine.setValue("[Library]", "AutoDjAddBottom", 1);
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x07, cmddc1.LEDBlue);
	} else {
		midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x07, cmddc1.LEDOff);
	}
}



cmddc1.shiftA = function(channel, control, value, status, group) {
    if (value === 127) {
        if(cmddc1.isShiftedA){
            cmddc1.isShiftedA = false;
            engine.setValue("[leftLib]", "show", 0);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x01, cmddc1.LEDOff);
        } else {
            cmddc1.isShiftedA = true;
            engine.setValue("[leftLib]", "show", 1);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x01, cmddc1.LEDBlue);
        }
    } else {

    }
}

cmddc1.shiftB = function(channel, control, value, status, group) {
     if (value === 127) {
        cmddc1.isShiftedB = true;


        midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x02, cmddc1.LEDBlue);
    } else {
        cmddc1.isShiftedB = false;

        midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x02, cmddc1.LEDOff);
    }
}

cmddc1.shiftC = function(channel, control, value, status, group) {
     if (value === 127) {
        if(cmddc1.isShiftedC) {
            cmddc1.isShiftedC = false;
            engine.setValue("[SamplersRack]", "show", 0);
            engine.setValue("[smalldecks]", "show", 1);
            engine.setValue("[Hifi]", "show", 1);
            engine.setValue("[Long]", "show", 0);
            engine.setValue("[bigdecks]", "show", 1);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x05, cmddc1.LEDOff);
        } else {
            cmddc1.isShiftedC = true;
            
            engine.setValue("[smalldecks]", "show", 0);
            engine.setValue("[Hifi]", "show", 0);
            engine.setValue("[Long]", "show", 1);
            engine.setValue("[LongWaveModule3]", "show", 1);
            engine.setValue("[LongWaveModule4]", "show", 1);
            engine.setValue("[bigdecks]", "show", 0);
            engine.setValue("[SamplersRack]", "show", 1);

            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x05, cmddc1.LEDBlue);
        }
        
    } else {
        
    }
}

cmddc1.shiftD = function(channel, control, value, status, group) {
    if (value === 127) {
        
	if(cmddc1.isShiftedD) {
            cmddc1.isShiftedD = false;
            cmddc1.isPushedRotor = false;

		if(!cmddc1.isAutodjEnabled) {
			 engine.setValue("[globalsRow]", "show", 0);
				engine.setValue("[LongWaveModule3]", "show", 0);
				engine.setValue("[LongWaveModule4]", "show", 0);
		} else {
			
		}
            
            engine.setValue("[Hifi]", "show", 1);
            engine.setValue("[Long]", "show", 0);
            engine.setValue("[bigdecks]", "show", 1);
 	    engine.setValue("[smalldecks]", "show", 1);
            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x06, cmddc1.LEDOff);
        } else {
            cmddc1.isShiftedD = true;

		if(!cmddc1.isAutodjEnabled) {
				engine.setValue("[LongWaveModule3]", "show", 1);
							engine.setValue("[LongWaveModule4]", "show", 1);
           		 engine.setValue("[globalsRow]", "show", 1);
			} else {
				engine.setValue("[LongWaveModule3]", "show", 0);
				engine.setValue("[LongWaveModule4]", "show", 0);
			}

          engine.setValue("[smalldecks]", "show", 0);
            engine.setValue("[Hifi]", "show", 0);
            engine.setValue("[Long]", "show", 1);
            engine.setValue("[bigdecks]", "show", 0);

            midi.sendShortMsg(cmddc1.defch | cmddc1.LEDCmd, 0x06, cmddc1.LEDBlue);
        }
        
    } else {
        
    }
}


/*
 * Convert an effect parameter value to the LED ring encoder scale
 */
cmddc1.encoderParamLEDValue = function(group, param) {
    var val = script.absoluteLinInverse(engine.getParameter(group, param), 0, 1, 1, cmddc1.encLEDCnt);
    if( val == cmddc1.encLEDCnt ) {
        val--; // Truncate the max value
    }
    return val;
};

/*
 * Turn on any encoder LED for a given value
 * connectControled function
 */
cmddc1.encoderFXLitLED = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControls[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};


cmddc1.encoderFXLitLED2 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControls2[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};


cmddc1.encoderFXLitLEDPadMain = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsPadMain[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};

cmddc1.encoderFXLitLEDCh1 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsCh1[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};

cmddc1.encoderFXLitLEDCh2 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsCh2[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};


cmddc1.encoderFXLitLEDCh3 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsCh3[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};


cmddc1.encoderFXLitLEDCh4 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsCh4[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};



cmddc1.encoderFXLitLEDPad5 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsPad5[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};


cmddc1.encoderFXLitLEDPad6 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsPad6[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};


cmddc1.encoderFXLitLEDPad7 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsPad7[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};

cmddc1.encoderFXLitLEDPad8 = function(value, group, control) {
    // Bright the corresponding LED(s)
    midi.sendShortMsg(cmddc1.defch | cmddc1.encLEDCmd,
                        cmddc1.FXControlsPad8[group+"."+control],
                        cmddc1.encoderParamLEDValue(group, control)
                        );
};


/*
 * Initialize FX related variables and connectControl the effects parameters
 */
cmddc1.connectFXEncoders = function() {
    /*var fxunit = 1;
    var fxctrl = cmddc1.FXCtrlStart;
    
    var grpref = "[EffectRack1_EffectUnit";
    var grpara = "super1";
    
    for(var i=1; i <= cmddc1.FXCtrlCnt; i++) {
        cmddc1.FXControls[grpref+i+"]."+grpara] = fxctrl;
        engine.connectControl(grpref+i+"]", grpara, "cmddc1.encoderFXLitLED");
        engine.trigger(grpref+i+"]", grpara);
        fxctrl++;
    }*/


  for(var sfxctrl in cmddc1.SFXControls2) {
        var sfxgrparam = cmddc1.SFXControls2[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControls2[cmddc1.SFXControls2[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLED2");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};


/*
 * Initialize Special FX related variables and connectControl the effects parameters
 */
cmddc1.connectSFXEncoders = function() {
    for(var sfxctrl in cmddc1.SFXControls) {
        var sfxgrparam = cmddc1.SFXControls[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControls[cmddc1.SFXControls[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLED");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};


cmddc1.connectSFXEncodersPadMain = function() {
    for(var sfxctrl in cmddc1.SFXControlsPadMain) {
        var sfxgrparam = cmddc1.SFXControlsPadMain[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsPadMain[cmddc1.SFXControlsPadMain[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDPadMain");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};

cmddc1.connectSFXEncodersCh1 = function() {
    for(var sfxctrl in cmddc1.SFXControlsCh1) {
        var sfxgrparam = cmddc1.SFXControlsCh1[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsCh1[cmddc1.SFXControlsCh1[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDCh1");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};


cmddc1.connectSFXEncodersCh2 = function() {
    for(var sfxctrl in cmddc1.SFXControlsCh2) {
        var sfxgrparam = cmddc1.SFXControlsCh2[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsCh2[cmddc1.SFXControlsCh2[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDCh2");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};


cmddc1.connectSFXEncodersCh3 = function() {
    for(var sfxctrl in cmddc1.SFXControlsCh3) {
        var sfxgrparam = cmddc1.SFXControlsCh3[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsCh3[cmddc1.SFXControlsCh3[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDCh3");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};


cmddc1.connectSFXEncodersCh4 = function() {
    for(var sfxctrl in cmddc1.SFXControlsCh4) {
        var sfxgrparam = cmddc1.SFXControlsCh4[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsCh4[cmddc1.SFXControlsCh4[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDCh4");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};




cmddc1.connectSFXEncodersPad5 = function() {
    for(var sfxctrl in cmddc1.SFXControlsPad5) {
        var sfxgrparam = cmddc1.SFXControlsPad5[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsPad5[cmddc1.SFXControlsPad5[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDPad5");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};

cmddc1.connectSFXEncodersPad6 = function() {
    for(var sfxctrl in cmddc1.SFXControlsPad6) {
        var sfxgrparam = cmddc1.SFXControlsPad6[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsPad6[cmddc1.SFXControlsPad6[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDPad6");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};

cmddc1.connectSFXEncodersPad7 = function() {
    for(var sfxctrl in cmddc1.SFXControlsPad7) {
        var sfxgrparam = cmddc1.SFXControlsPad7[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsPad7[cmddc1.SFXControlsPad7[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDPad7");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};

cmddc1.connectSFXEncodersPad8 = function() {
    for(var sfxctrl in cmddc1.SFXControlsPad8) {
        var sfxgrparam = cmddc1.SFXControlsPad8[sfxctrl].split(".");
        // Add an entry and affect a physical control address to the parameter string
        // A virtual line is added with same control for compatibility with encoderFXLitLED()
        cmddc1.FXControlsPad8[cmddc1.SFXControlsPad8[sfxctrl]] = sfxctrl;
        
        engine.connectControl(sfxgrparam[0], sfxgrparam[1], "cmddc1.encoderFXLitLEDPad8");
        // Init LEDs of SFX Encoders
        engine.trigger(sfxgrparam[0], sfxgrparam[1]);
    }
};


/*** Constructor ***/
cmddc1.init = function() {
    cmddc1.initLEDs();
   
    cmddc1.initDecksStatus();


	engine.setParameter("[Sampler1]", "volume", 0);
   	engine.setParameter("[Sampler2]", "volume", 0);
	engine.setParameter("[Sampler3]", "volume", 0);
	engine.setParameter("[Sampler4]", "volume", 0);

	engine.setParameter("[Sampler9]", "volume", 0);
   	engine.setParameter("[Sampler10]", "volume", 0);
	engine.setParameter("[Sampler11]", "volume", 0);
	engine.setParameter("[Sampler12]", "volume", 0);


	engine.setParameter("[Sampler5]", "volume", 0);
   	engine.setParameter("[Sampler6]", "volume", 0);
	engine.setParameter("[Sampler7]", "volume", 0);
	engine.setParameter("[Sampler8]", "volume", 0);

	engine.setParameter("[Sampler13]", "volume", 0);
   	engine.setParameter("[Sampler14]", "volume", 0);
	engine.setParameter("[Sampler15]", "volume", 0);
	engine.setParameter("[Sampler16]", "volume", 0);


	engine.setParameter("[Sampler33]", "volume", 0);
   	engine.setParameter("[Sampler34]", "volume", 0);
	engine.setParameter("[Sampler35]", "volume", 0);
	engine.setParameter("[Sampler36]", "volume", 0);

   	engine.setParameter("[Sampler41]", "volume", 0);
	engine.setParameter("[Sampler42]", "volume", 0);
	engine.setParameter("[Sampler43]", "volume", 0);
	engine.setParameter("[Sampler44]", "volume", 0);


	engine.setParameter("[Sampler37]", "volume", 0);
   	engine.setParameter("[Sampler38]", "volume", 0);
	engine.setParameter("[Sampler39]", "volume", 0);
	engine.setParameter("[Sampler40]", "volume", 0);

   	engine.setParameter("[Sampler45]", "volume", 0);
	engine.setParameter("[Sampler46]", "volume", 0);
	engine.setParameter("[Sampler47]", "volume", 0);
	engine.setParameter("[Sampler48]", "volume", 0);


};

/*** Destructor ***/
cmddc1.shutdown = function() {
    cmddc1.initLEDs();
};
