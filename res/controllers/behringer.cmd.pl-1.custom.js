function myCustomDeck(channel, deck) {
  var masterGroup = '[Master]';
  var channelGroup = '[Channel' + (1 + channel) + ']';

  var forceScratch = false;
  var link = {};

  var isPitchUnlocked = false;
  var isScratchUnlocked = false; 
  var isLoaded = false;
  var isLocked = false;
	var isTapped = false;
  var isCued = false;
	var isPlaying = [false, false, false, false];
	var isRaising = [false, false, false, false];
	var activeDeck = 0;
	var activeGroup = '[Channel1]';

	var eqBass = [];


  // SETUP AND RELEASE


  deck.playPause.setup = function () {
    updatePlayPause();
    link.playPause = connect(channelGroup, 'play', updatePlayPause);
  };


   deck.lock.setup = function () {
    link.keylock = connect(channelGroup, 'keylock', updateKeylock);
  };


  deck.lock.release = function () {
    link.keylock.disconnect();
    delete link.keylock;

    deck.lock.led.off();
  };

  deck.playPause.release = function () {
    link.playPause.disconnect();
    delete link.playPause;

    deck.playPause.led.off();
  };





  // CONTROLLER CHANGES






deck.cue.change = function(value, group) {
    if (value) {

    

      		deck.cue.led.on();
			deck.load.led.blink();


			

		  isCued = true;	
 			if(isTapped){
				//engine.setValue(group, "play", 0);
				//engine.setValue(group, "eject", 1);
			}
    } else {

    		//engine.setValue(group, "scratch2_enable", 0);

			deck.cue.led.off();
			deck.load.led.off();
			engine.setValue(group, "eject", 0);	
			//isTapped = false;	
			isCued = false;
		

		        engine.setValue(group, "slip_enabled", 0);
		        engine.setValue(group, "scratch2_enable", 0);

			

    }
  };







	// PLAY

  deck.playPause.change = function (value, group) {
		var deckNumber = parseInt(group.substring(8,9)); // work out which deck we are using 
		var channelNumber = deckNumber - 1;



    if (true === value) {
    	if(isTapped === true) {
				engine.setValue(group, "play", 0);
				engine.setValue(group, "eject", 1);

				resetAll(group);
		} else if(engine.getValue(group, 'playposition') === 1 || isPitchUnlocked) {
			engine.setValue(group, 'play', 0);
			engine.setValue(group, "eject", 1);
				resetAll(group);

      	} else if(BehringerCmdPl1.isWheelTouched(channelNumber) && isTapped || isTapped) {
  			engine.setParameter(group, "volume", 0);
  			engine.setValue(group, 'play', 0);
      	} else if (!engine.getValue(group, 'play') && isCued) {
        //engine.softStart(deckNumber, true);
			//engine.softStart(deckNumber, false);
			engine.setValue(group, 'play', 1);
      	}  else if (engine.getValue(group, 'track_loaded') === 0){ // act on button release
      		engine.setValue(group, "LoadSelectedTrack", 1);

            //engine.brake(deckNumber, true);
            //engine.brake(deckNumber, false);
		} else if(!engine.getValue(group, 'play')){
			engine.softStart(deckNumber, true, 32);
    	
		} else if(isCued){
			engine.setValue(group, 'play', 0);
       
		} else if(BehringerCmdPl1.getSyncedScratched()) {
            engine.brake(deckNumber, true, 0.250);
    	}  
	} else {
	     // slow down the track
	     
	} 
  };








	deck.minus.change = function(value, group) {
    if(value) {


      deck.minus.led.on();
			if(isCued){
			  engine.setValue(group, 'bpm_down', 1);
			} else if(isTapped){
				engine.spinback(1, true, 16);
			} else {
				engine.setValue(group, 'bpm_down_small', 1);
			}
    } else {
      deck.minus.led.off();
    }
  };

	deck.plus.change = function(value, group) {
    if(value) {

 		 deck.plus.led.on();
			if(isCued){
		    	engine.setValue(group, 'bpm_up', 1); 
      } else {
				engine.setValue(group, 'bpm_up_small', 1);
			}
    } else {
      deck.plus.led.off();
    }
  };


deck.backward.change = function (value, group) {
	if (true === value) {
		if(isTapped){
			engine.setValue(group,"reverse", 1);
			deck.backward.led.blink();
		} else {
        	engine.setValue("[Library]", "MoveVertical", -1);
			deck.backward.led.on();
		}
	} else {
		engine.setValue(group,"reverse", 0);
	  deck.backward.led.off();
	}
}

deck.forward.change = function (value, group) {
	if (true === value) {
		if(isTapped){
			engine.setValue(group,"reverseroll", 1);
			deck.forward.led.blink();
		} else {
        	engine.setValue("[Library]", "MoveVertical", 1);
			deck.forward.led.on();
		}
	} else {
		engine.setValue(group,"reverseroll", 0);
		deck.forward.led.off();
	}
}

deck.tap.change = function(value, group) {
    if(value) {
			isTapped = true;  
			BehringerCmdPl1.tapTapped(true);    
			deck.tap.led.on();
			deck.backward.led.blink();
			deck.forward.led.blink();
		

			var volume = engine.getValue(group, 'volume');
			deck.pitch.led.level(0, 1, volume.toFixed(1)); 


 			if(engine.getValue(group, 'play')){
				deck.cue.led.blink();
				
			}
    } else {

    		var bpm = engine.getValue(group, 'bpm');
			deck.pitch.led.level(0, 200, bpm); 

			isTapped = false;	
			BehringerCmdPl1.tapTapped(false);  
			//updateLoaded();
            deck.tap.led.off();
			deck.cue.led.off();
			deck.backward.led.off();
			deck.forward.led.off();
			
				
    }
  };
















  deck.b1.change = function(value, group) {
   if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_1_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_1_enabled')) {
				engine.setValue(group, "hotcue_1_goto", 1);
			} else {
				engine.setValue(group, "hotcue_1_activate", 1);
			}
		} else if(!engine.getValue(group, 'track_loaded')) {
			engine.setValue(group, "CloneFromDeck", 1);
		} else if(!engine.getValue('[Channel1]', 'track_loaded')) {
			engine.setValue('[Channel1]', "CloneFromDeck", 1 + channel)
		} 
    } else {
			
    }
  };

  deck.b2.change = function(value, group) {
	if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_2_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_2_enabled')) {
				engine.setValue(group, "hotcue_2_goto", 1);
			} else {
				engine.setValue(group, "hotcue_2_activate", 1);
			}
		} else if(!engine.getValue(group, 'track_loaded')) {
			engine.setValue(group, "CloneFromDeck", 2);
		} else if(!engine.getValue('[Channel2]', 'track_loaded')) {
			engine.setValue('[Channel2]', "CloneFromDeck", 1 + channel)
		} 
    } else {
			
    }
  
				 //	var deck = parseInt(group.substring(8,9)); // work out which deck we are using
			       //engine.brake(deck, true, 0.333);
			
			
  

		
  };

  deck.b3.change = function(value, group) {
  	if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_3_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_3_enabled')) {
				engine.setValue(group, "hotcue_3_goto", 1);
			} else {
				engine.setValue(group, "hotcue_3_activate", 1);
			}
		} else if(!engine.getValue(group, 'track_loaded')) {
			engine.setValue(group, "CloneFromDeck", 3);
		} else if(!engine.getValue('[Channel3]', 'track_loaded')) {
			engine.setValue('[Channel3]', "CloneFromDeck", 1 + channel)
		} 
    } else {
			
    }


  };

  deck.b4.change = function(value, group) {
   if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_4_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_4_enabled')) {
				engine.setValue(group, "hotcue_4_goto", 1);
			} else {
				engine.setValue(group, "hotcue_4_activate", 1);
			}
		} else if(!engine.getValue(group, 'track_loaded')) {
			engine.setValue(group, "CloneFromDeck", 4);
		} else if(!engine.getValue('[Channel4]', 'track_loaded')) {
			engine.setValue('[Channel4]', "CloneFromDeck", 1 + channel)
		} 
    } else {
			
    }

  };

  deck.b5.change = function(value, group) {
   if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_5_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_5_enabled')) {
				engine.setValue(group, "hotcue_5_goto", 1);
			} else {
				engine.setValue(group, "hotcue_5_activate", 1);
			}
		}
    } else {
			
    }
  };

   deck.b6.change = function(value, group) {
   if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_6_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_6_enabled')) {
				engine.setValue(group, "hotcue_6_goto", 1);
			} else {
				engine.setValue(group, "hotcue_6_activate", 1);
			}
		}
    } else {
			
    }
  };

  deck.b7.change = function(value, group) {
   if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_7_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_7_enabled')) {
				engine.setValue(group, "hotcue_7_goto", 1);
			} else {
				engine.setValue(group, "hotcue_7_activate", 1);
			}
		}
    } else {
			
    }
  };

  deck.b8.change = function(value, group) {
   if (value) {
		if(isCued) {
			engine.setValue(group, "hotcue_8_clear", 1);
		} else if(!engine.getValue(group, 'play') && engine.getValue(group, 'track_loaded')){
			if(engine.getValue(group, 'hotcue_8_enabled')) {
				engine.setValue(group, "hotcue_8_goto", 1);
			} else {
				engine.setValue(group, "hotcue_8_activate", 1);
			}
		}
    } else {
			
    }
  };


deck.deck.change = function (value, group) {
	if (value) {
		/*for (var ch = 0; ch < BehringerCmdPl1.deck.length; ch++){
			BehringerCmdPl1.deck[ch].e5.led.off();
			BehringerCmdPl1.deck[ch].e6.led.off();
			BehringerCmdPl1.deck[ch].e7.led.off();	
			BehringerCmdPl1.deck[ch].e8.led.off();
		}*/
			

		activeGroup = group;
		var deckNumber = parseInt(activeGroup.substring(8,9)); // work out which deck we are using 
		activeDeck = deckNumber;
		
			deck.pitch.led.off(); 

			// set automatic imagination layer of a deck for EQ so it looks like 4ch on 1ch mix, výjeb xD
			BehringerCmdPl1.deckEq(channelGroup);
		
			deck.b1.led.off();
			deck.b2.led.off();
			deck.b3.led.off();
			deck.b4.led.off();
			
			BehringerCmdPl1.deck[0].e5.led.off();
			BehringerCmdPl1.deck[0].e6.led.off();
			BehringerCmdPl1.deck[0].e7.led.off();
			BehringerCmdPl1.deck[0].e8.led.off();

			BehringerCmdPl1.scratched(false)
			BehringerCmdPl1.setSyncedScratched(false);

			isScratchUnlocked = false;

			deck.scratch.led.off();
			deck.sync.led.off();

			deck.load.led.on();
	} else {
		/*for (var ch = 0; ch < BehringerCmdPl1.deck.length; ch++){
			switch(channel) {
  				case 0:
						BehringerCmdPl1.deck[ch].e5.led.on();
    				break;
  				case 1:
						BehringerCmdPl1.deck[ch].e6.led.on();
    				break;
					case 2:
    				BehringerCmdPl1.deck[ch].e7.led.on();
    				break;
					case 3:
    				BehringerCmdPl1.deck[ch].e8.led.on();
    				break;
			}	
		}*/

			

			switch(channel) {
  				case 0:
					deck.b1.led.on();
    				break;
  				case 1:
					deck.b2.led.on();
    				break;
				case 2:
    				deck.b3.led.on();
    				break;
				case 3:
    				deck.b4.led.on();
					break;
			}	

			var bpm = engine.getValue(group, 'bpm');
			deck.pitch.led.level(0, 200, bpm); 
			
			//updateLoaded();
			deck.load.led.off();	
			checkFilter();
	}
}

	deck.load.change = function(value, group) {


		/*updateLoaded();
		if(engine.getValue(channelGroup, 'play')){
			if(value) {
		    deck.load.led.on();
		    isLoaded = true;
				var volume = engine.getValue(group, 'volume');
				deck.pitch.led.level(0, 0.9, volume); 
		  } else {
		    deck.load.led.off();
		    isLoaded = false;
				deck.pitch.led.off();
		  }
		} else {
				if (value) {
					deck.load.led.on();
				  engine.setValue(group, "LoadSelectedTrack", 1);
				} else {
				  deck.load.led.off();
				}
		}    */
	if (value) {
    	deck.load.led.on();
        isPitchUnlocked = true;
		var bpm = engine.getValue(group, 'bpm');
		deck.pitch.led.level(0, 200, bpm);
    } else {
      	isPitchUnlocked = false;
		deck.load.led.off();
    }
  };

    deck.lock.change = function(value, group) {
	    if (value) {
   			if(isLoaded){
   				engine.setValue(group, 'keylock', 0);
   				engine.setValue(group, 'quantize', 0);   				
				isLoaded = false;
				//deck.lock.led.off();
   			} else {
   				engine.setValue(group, 'keylock', 1);
   				engine.setValue(group, 'quantize', 0);   				
   				isLoaded = true;
				//deck.lock.led.on();
   			}

   			updateKeylock()
	    } else { 	
	    }
	};

  deck.e1.change = function(value, group) {
	
	var deckEq = BehringerCmdPl1.deckEq();
	var eqBass = engine.getValue('[QuickEffectRack1_[Channel1]]', 'super1');
	var precision = 100;
    var step      = 1;
    var amount = eqBass * precision;

    if (value === 63) {
		engine.setValue('[QuickEffectRack1_[Channel1]]', 'super1', 0.5);
		deck.e1.led.level(0, 1.1, 0.5);
	    BehringerCmdPl1.deck[0].e1.led.on();
	} else if (value > 0) {
        amount = (amount + step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel1]]', 'super1', amount);
		BehringerCmdPl1.deck[0].e1.led.off();
		deck.e1.led.level(0, 1.1, amount);
    } else {
        amount = (amount - step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel1]]', 'super1', amount);
		BehringerCmdPl1.deck[0].e1.led.off();
		deck.e1.led.level(0, 1.1, amount);
	}
	 




		/*var eqBass = engine.getValue('[EffectRack1_EffectUnit1]', 'super1');
		var precision = 100;
	    	var step      = 4;
	    	var amount = eqBass * precision;
  

    		if (value === 63) {
			engine.setValue('[EffectRack1_EffectUnit1]', 'super1', 0.5);
			BehringerCmdPl1.deck[0].e1.led.level(0, 1.1, 0.5);
			
		} else if (value > 0) {
			amount = (amount + step) / precision;
			engine.setValue('[EffectRack1_EffectUnit1]', 'super1', amount);
			BehringerCmdPl1.deck[0].e1.led.level(0, 1.1, amount);
    		} else {
			amount = (amount - step) / precision;
			engine.setValue('[EffectRack1_EffectUnit1]', 'super1', amount);
			BehringerCmdPl1.deck[0].e1.led.level(0, 1.1, amount);
		}*/
  };

  deck.e2.change = function(value, group) {



  	var deckEq = BehringerCmdPl1.deckEq();
		var eqMid = engine.getValue('[QuickEffectRack1_[Channel2]]', 'super1');
		var precision = 100;
    var step      = 1;
    var amount = eqMid * precision;

 
		if (value === 63) {
				engine.setValue('[QuickEffectRack1_[Channel2]]', 'super1', 0.5);
				BehringerCmdPl1.deck[0].e2.led.on();

				deck.e2.led.level(0, 1.1, 0.5);
		} else if (value > 0) {
        amount = (amount + step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel2]]', 'super1', amount);
        		BehringerCmdPl1.deck[0].e2.led.off();
				deck.e2.led.level(0, 1.1, amount);
    } else {
        amount = (amount - step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel2]]', 'super1', amount);
                		BehringerCmdPl1.deck[0].e2.led.off();

				deck.e2.led.level(0, 1.1, amount);
		}



		/*var eqBass = engine.getValue('[EffectRack1_EffectUnit1]', 'mix');
		var precision = 100;
	    	var step      = 4;
	    	var amount = eqBass * precision;
  

    		if (value === 63) {
			engine.setValue('[EffectRack1_EffectUnit1]', 'mix', 0.5);
			BehringerCmdPl1.deck[0].e2.led.level(0, 1.1, 0.5);
			
		} else if (value > 0) {
			amount = (amount + step) / precision;
			engine.setValue('[EffectRack1_EffectUnit1]', 'mix', amount);
			BehringerCmdPl1.deck[0].e2.led.level(0, 1.1, amount);
    		} else {
			amount = (amount - step) / precision;
			engine.setValue('[EffectRack1_EffectUnit1]', 'mix', amount);
			BehringerCmdPl1.deck[0].e2.led.level(0, 1.1, amount);
		}*/	

  };

 deck.e3.change = function(value, group) {
		

	var deckEq = BehringerCmdPl1.deckEq();
    var eqHigh = engine.getValue('[QuickEffectRack1_[Channel3]]', 'super1');
		var precision = 100;
    var step      = 1;
    var amount = eqHigh * precision;

   

		if (value === 63) {
				engine.setValue('[QuickEffectRack1_[Channel3]]', 'super1', 0.5);
				        		BehringerCmdPl1.deck[0].e3.led.on();

				deck.e3.led.level(0, 1.1, 0.5);
		} else if (value > 0) {
        amount = (amount + step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel3]]', 'super1', amount);
        				        		BehringerCmdPl1.deck[0].e3.led.off();

				deck.e3.led.level(0, 1.1, amount);
    } else {
        amount = (amount - step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel3]]', 'super1', amount);
        				        		BehringerCmdPl1.deck[0].e3.led.off();

				deck.e3.led.level(0, 1.1, amount);
		}

	

/*
		var eqBass = engine.getValue('[EffectRack1_EffectUnit2]', 'super1');
		var precision = 100;
	    	var step      = 4;
	    	var amount = eqBass * precision;
  

    		if (value === 63) {
			engine.setValue('[EffectRack1_EffectUnit2]', 'super1', 0.5);
			BehringerCmdPl1.deck[0].e3.led.level(0, 1.1, 0.5);
			
		} else if (value > 0) {
			amount = (amount + step) / precision;
			engine.setValue('[EffectRack1_EffectUnit2]', 'super1', amount);
			BehringerCmdPl1.deck[0].e3.led.level(0, 1.1, amount);
    		} else {
			amount = (amount - step) / precision;
			engine.setValue('[EffectRack1_EffectUnit2]', 'super1', amount);
			BehringerCmdPl1.deck[0].e3.led.level(0, 1.1, amount);
		}	*/

  };


		var break4value = 0.1;

 deck.e4.change = function(value, group) {
		
	var deckEq = BehringerCmdPl1.deckEq();
		var eqGain = engine.getValue('[QuickEffectRack1_[Channel4]]', 'super1');
		var precision = 100;
    var step      = 1;
    var amount = eqGain * precision;

   


		if (value === 63) {
				engine.setValue('[QuickEffectRack1_[Channel4]]', 'super1', 0.5);
								        		BehringerCmdPl1.deck[0].e4.led.on();

				deck.e4.led.level(0, 1.1, 0.5);

				

		} else if (value > 0) {
        amount = (amount + step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel4]]', 'super1', amount);
        				        		BehringerCmdPl1.deck[0].e4.led.off();

				deck.e4.led.level(0, 1.1, amount);
			
    } else {
        amount = (amount - step) / precision;
        engine.setValue('[QuickEffectRack1_[Channel4]]', 'super1', amount);
        				        		BehringerCmdPl1.deck[0].e4.led.off();

				deck.e4.led.level(0, 1.1, amount);
				
		}


/*	
		var deck = parseInt(group.substring(8,9)); // work out which deck we are using
		var precision = 100;
	    	var step = 10;
	    	var amount = break4value * precision;

				print("^^^^^^^^^^^^^^^^ NOW - " + value);


				if((break4value >= 0.1) && (break4value <= 100)) {

				
					if(value === -64){	
					       
						if(isCued){

							engine.brake(1, false);
							engine.setParameter("[Channel1]", "play", 1);
						} else {
						       engine.softStart(1, true, break4value);
						} 




						BehringerCmdPl1.deck[0].e4.led.off();

					} else if(value === 63){	
						print("^^^^^^^^^^^^^^^^ push - " + break4value);

						BehringerCmdPl1.deck[0].e4.led.on();

					       engine.brake(1, true, break4value);
			
					}  else if (value > 0) {
						break4value = ((amount + step) / precision).toFixed(1);
		       				print("^^^^^^^^^^^^^^^^ right - " + break4value);
						
		 				 //BehringerCmdPl1.deck[0].e4.led.level(0, 1.1, break4value);

		    			} else if(break4value != 0.1){
						break4value = ((amount - step) / precision).toFixed(1);
		       				print("^^^^^^^^^^^^^^^^ left - " + break4value);
						//BehringerCmdPl1.deck[0].e4.led.level(0, 1.1, break4value);

					}



				}


// effect

		var eqBass = engine.getValue('[EffectRack1_EffectUnit2]', 'mix');
		var precision = 100;
	    	var step      = 4;
	    	var amount = eqBass * precision;
  
		
    		if (value === 63) {
			engine.setValue('[EffectRack1_EffectUnit2]', 'mix', 0.5);
			BehringerCmdPl1.deck[0].e4.led.level(0, 1.1, 0.5);
			var reset = true;
			
		} else if (value > 0) {
			amount = (amount + step) / precision;
			engine.setValue('[EffectRack1_EffectUnit2]', 'mix', amount);
			BehringerCmdPl1.deck[0].e4.led.level(0, 1.1, amount);
			
    		} else {
			amount = (amount - step) / precision;
			engine.setValue('[EffectRack1_EffectUnit2]', 'mix', amount);
			BehringerCmdPl1.deck[0].e4.led.level(0, 1.1, amount);
		}	
*/
			
  };


 deck.e5.change = function(value, group) {
	
	
		if(BehringerCmdPl1.deckEq() === "[Channel1]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter1');
		} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter1');
		} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter1');
		} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter1');
		}

		var precision = 100;
	    var step      = 10;
	    var amount = eqBass * precision;

    	if (value === 63) {
			if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter1', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter1', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter1', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter1', 1);
			}

			deck.e5.led.level(0, 1.1, 0.5);
	  		BehringerCmdPl1.deck[0].e5.led.on();

		} else if (value > 0) {
	        amount = (amount + step) / precision;

	        if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter1', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter1', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter1', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter1', amount);
			}

	  		BehringerCmdPl1.deck[0].e5.led.off();
			deck.e5.led.level(0, 2.1, amount);

		} else {
    		amount = (amount - step) / precision;

     		if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter1', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter1', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter1', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter1', amount);
			}
				
	  		BehringerCmdPl1.deck[0].e5.led.off();
			deck.e5.led.level(0, 2.1, amount);
		}
  };


 deck.e6.change = function(value, group) {
		if(BehringerCmdPl1.deckEq() === "[Channel1]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter2');
		} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter2');
		} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter2');
		} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter2');
		}

		var precision = 100;
	    var step      = 10;
	    var amount = eqBass * precision;

    	if (value === 63) {
			if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter2', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter2', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter2', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter2', 1);
			}

			deck.e6.led.level(0, 1.1, 0.5);
	  		BehringerCmdPl1.deck[0].e6.led.on();

		} else if (value > 0) {
	        amount = (amount + step) / precision;

	        if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter2', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter2', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter2', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter2', amount);
			}

	  		BehringerCmdPl1.deck[0].e6.led.off();
			deck.e6.led.level(0, 2.1, amount);

		} else {
    		amount = (amount - step) / precision;

     		if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter2', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter2', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter2', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter2', amount);
			}
				
	  		BehringerCmdPl1.deck[0].e6.led.off();
			deck.e6.led.level(0, 2.1, amount);
		}

	 
 };

 deck.e7.change = function(value, group) {
	if(BehringerCmdPl1.deckEq() === "[Channel1]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter3');
		} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter3');
		} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter3');
		} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
			var eqBass = engine.getValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter3');
		}

		var precision = 100;
	    var step      = 10;
	    var amount = eqBass * precision;

    	if (value === 63) {
			if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter3', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter3', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter3', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter3', 1);
			}

			deck.e7.led.level(0, 1.1, 0.5);
	  		BehringerCmdPl1.deck[0].e7.led.on();

		} else if (value > 0) {
	        amount = (amount + step) / precision;

	        if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter3', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter3', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter3', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter3', amount);
			}

	  		BehringerCmdPl1.deck[0].e7.led.off();
			deck.e7.led.level(0, 2.1, amount);

		} else {
    		amount = (amount - step) / precision;

     		if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter3', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter3', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter3', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter3', amount);
			}
				
	  		BehringerCmdPl1.deck[0].e7.led.off();
			deck.e7.led.level(0, 2.1, amount);
		}


 };

 deck.e8.change = function(value, group) {
	
	 if(BehringerCmdPl1.deckEq() === "[Channel1]"){
			var eqBass = engine.getValue('[Channel1]', 'pregain');
		} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
			var eqBass = engine.getValue('[Channel2]', 'pregain');
		} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
			var eqBass = engine.getValue('[Channel3]', 'pregain');
		} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
			var eqBass = engine.getValue('[Channel4]', 'pregain');
		}

		var precision = 100;
	    var step      = 10;
	    var amount = eqBass * precision;

    	if (value === 63) {
			if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[Channel1]', 'pregain', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[Channel2]', 'pregain', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[Channel3]', 'pregain', 1);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[Channel4]', 'pregain', 1);
			}

			deck.e8.led.level(0, 1.1, 0.5);
	  		BehringerCmdPl1.deck[0].e8.led.on();

		} else if (value > 0) {
	        amount = (amount + step) / precision;

	        if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[Channel1]', 'pregain', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[Channel2]', 'pregain', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[Channel3]', 'pregain', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[Channel4]', 'pregain', amount);
			}

	  		BehringerCmdPl1.deck[0].e8.led.off();
			deck.e8.led.level(0, 2.1, amount);

		} else {
    		amount = (amount - step) / precision;

     		if(BehringerCmdPl1.deckEq() === "[Channel1]"){
				engine.setValue('[Channel1]', 'pregain', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel2]"){
				engine.setValue('[Channel2]', 'pregain', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel3]"){
				engine.setValue('[Channel3]', 'pregain', amount);
			} else if(BehringerCmdPl1.deckEq() === "[Channel4]"){
				engine.setValue('[Channel4]', 'pregain', amount);
			}
				
	  		BehringerCmdPl1.deck[0].e8.led.off();
			deck.e8.led.level(0, 2.1, amount);
		}


 };

deck.sync.change = function (value, group) {
	if (value === true) {
		deck.sync.led.on();

		if(BehringerCmdPl1.getScratched()){
			engine.setValue(group, "slip_enabled", 1);
			BehringerCmdPl1.setSyncedScratched(true);
			deck.sync.led.blink();
		} 


		if(isCued){
			engine.setValue(group, "rate_set_default", 1);
		} else {
			//engine.setValue(group, "beatsync_tempo", 1);
		}

		

	} else {
		
		if(!BehringerCmdPl1.getScratched()){
			engine.setValue(group, "slip_enabled", 0);
			BehringerCmdPl1.setSyncedScratched(false);
			deck.sync.led.off();
		} 
	}
}




  deck.scratch.change = function (value, group) {
    if (value) {
      	if (!isScratchUnlocked) {
			deck.scratch.led.on();
			isScratchUnlocked = true;
			BehringerCmdPl1.scratched(true);    


		/*	deck.b1.led.off();
			deck.b2.led.off();
			deck.b3.led.off();
			deck.b4.led.off(); 

			switch(channel) {
				case 0:
					deck.b2.led.blink();
					deck.b3.led.blink();
					deck.b4.led.blink();
				break;
				case 1:
					deck.b1.led.blink();
					deck.b3.led.blink();
					deck.b4.led.blink();
				break;
				case 2:
				deck.b1.led.blink();
					deck.b2.led.blink();
					deck.b4.led.blink();
				break;
				case 3:
				deck.b1.led.blink();
					deck.b2.led.blink();
					deck.b3.led.blink();
				break;
			}*/
    	} else {
    		isScratchUnlocked = false;
			BehringerCmdPl1.scratched(false); 
			BehringerCmdPl1.setSyncedScratched(false);
   


    		
			deck.sync.led.off();
	        deck.scratch.led.off();
			/*deck.b1.led.off();
			deck.b2.led.off();
			deck.b3.led.off();
			deck.b4.led.off(); */
    	}
	} else {
		
      	//updateLoaded();
    }
  };

  deck.pitch.change = function (value, group) {
	  zoomWave = engine.getValue(group, "waveform_zoom");

  	/*if (isScratchUnlocked) {
		var volume = (value + 1)/2;
		deck.pitch.led.level(-1, 1.2, value); 
		engine.setValue(group, 'volume', volume);
	} else */

	if(isPitchUnlocked){
		
		var BPM_MIN = 0;
    	var BPM_MAX = 200;

    	var MAX = 0.9981687217677939;
    	var MIN = -1.0001220852154804;
    	var RES = 10;

    	var val = (value - MIN) / (MAX - MIN) * (BPM_MAX - BPM_MIN) + BPM_MIN;
    	var ival = Math.floor(val);
    	val = (ival + Math.round((val - ival) * RES) / RES);

    	engine.setValue(group, 'bpm', val);
		deck.pitch.led.level(-1, 1.2, value); 

    } else {
  		
		zoomWave = (((value + 1)/2)*10);
		zoomWave = zoomWave.toFixed(1);

		//print(zoomWave);

			engine.setValue(group, "waveform_zoom", zoomWave);


		if(zoomWave >= 0.1) {
		}

  	}

		
		

		//deck.pitch.led.level(-1, 1.2, value);
		

	/*
else if (isCued || isTapped) {
			var volume = (value + 1)/2;
			deck.pitch.led.level(-1, 1.2, value); 
			engine.setValue(group, 'volume', volume);
		}
	*/

		
  };

  // NON API FUNCTIONS



  function updatePlayPause() {
		//updateLoaded();
		if (engine.getValue(channelGroup, 'play')) {
      deck.playPause.led.on();
    } else {
      deck.playPause.led.off();
    }
  }

function updateKeylock() {
		//updateLoaded();
		if (engine.getValue(channelGroup, 'keylock')) {
      deck.lock.led.on();
    } else {
      deck.lock.led.off();
    }
  }


  function resetAll(group) {
	/*engine.setValue('[QuickEffectRack1_'+group+']', 'super1', 1);
	engine.setValue('[EqualizerRack1_'+group+'_Effect1]', 'parameter1', 1);
	engine.setValue('[EqualizerRack1_'+group+'_Effect1]', 'parameter2', 1);
	engine.setValue('[EqualizerRack1_'+group+'_Effect1]', 'parameter3', 1);
	engine.setValue(group, 'pregain',1);*/


		engine.setValue(group, "volume", 0);


}


  function checkFilter() {

	  var filter1 = engine.getValue('[QuickEffectRack1_[Channel1]]', 'super1');
	  var filter2 = engine.getValue('[QuickEffectRack1_[Channel2]]', 'super1');
	  var filter3 = engine.getValue('[QuickEffectRack1_[Channel3]]', 'super1');
	  var filter4 = engine.getValue('[QuickEffectRack1_[Channel4]]', 'super1');


	var eqBass1 = engine.getValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter1');
	var eqBass2 = engine.getValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter1');
	var eqBass3 = engine.getValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter1');
	var eqBass4 = engine.getValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter1');


	var eqMid1 = engine.getValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter2');
	var eqMid2 = engine.getValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter2');
	var eqMid3 = engine.getValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter2');
	var eqMid4 = engine.getValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter2');

	var eqHigh1 = engine.getValue('[EqualizerRack1_[Channel1]_Effect1]', 'parameter3');
	var eqHigh2 = engine.getValue('[EqualizerRack1_[Channel2]_Effect1]', 'parameter3');
	var eqHigh3 = engine.getValue('[EqualizerRack1_[Channel3]_Effect1]', 'parameter3');
	var eqHigh4 = engine.getValue('[EqualizerRack1_[Channel4]_Effect1]', 'parameter3');

	var Gain1 = engine.getValue('[Channel1]', 'pregain');
	var Gain2 = engine.getValue('[Channel2]', 'pregain');
	var Gain3 = engine.getValue('[Channel3]', 'pregain');
	var Gain4 = engine.getValue('[Channel4]', 'pregain');



			switch(channel) {
  				case 0:
					 if(eqBass1 === 1) {
						  BehringerCmdPl1.deck[0].e5.led.on();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass1);

					  } else {
						  BehringerCmdPl1.deck[0].e5.led.off();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass1);
					  }

					  if(eqMid1 === 1) {
						  BehringerCmdPl1.deck[0].e6.led.on();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid1);

					  } else {
						  BehringerCmdPl1.deck[0].e6.led.off();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid1);
					  }

					   if(eqHigh1 === 1) {
						  BehringerCmdPl1.deck[0].e7.led.on();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh1);

					  } else {
						  BehringerCmdPl1.deck[0].e7.led.off();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh1);
					  }

 					if(Gain1 === 1) {
						  BehringerCmdPl1.deck[0].e8.led.on();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain1);

					  } else {
						  BehringerCmdPl1.deck[0].e8.led.off();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain1);
					  }

    				break;
  				case 1:
 					if(eqBass2 === 1) {
						  BehringerCmdPl1.deck[0].e5.led.on();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass2);

					  } else {
						  BehringerCmdPl1.deck[0].e5.led.off();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass2);
					  }   

				      if(eqMid2 === 1) {
						  BehringerCmdPl1.deck[0].e6.led.on();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid2);

					  } else {
						  BehringerCmdPl1.deck[0].e6.led.off();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid2);
					  } 

					  if(eqHigh2 === 1) {
						  BehringerCmdPl1.deck[0].e7.led.on();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh2);

					  } else {
						  BehringerCmdPl1.deck[0].e7.led.off();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh2);
					  }

					  if(Gain2 === 1) {
						  BehringerCmdPl1.deck[0].e8.led.on();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain2);

					  } else {
						  BehringerCmdPl1.deck[0].e8.led.off();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain2);
					  }

					  break;
				case 2:
 					if(eqBass3 === 1) {
						  BehringerCmdPl1.deck[0].e5.led.on();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass3);

					  } else {
						  BehringerCmdPl1.deck[0].e5.led.off();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass3);
					  }

					   if(eqMid3 === 1) {
						  BehringerCmdPl1.deck[0].e6.led.on();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid3);

					  } else {
						  BehringerCmdPl1.deck[0].e6.led.off();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid3);
					  }

					  if(eqHigh3 === 1) {
						  BehringerCmdPl1.deck[0].e7.led.on();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh3);

					  } else {
						  BehringerCmdPl1.deck[0].e7.led.off();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh3);
					  }

					  if(Gain3 === 1) {
						  BehringerCmdPl1.deck[0].e8.led.on();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain3);

					  } else {
						  BehringerCmdPl1.deck[0].e8.led.off();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain3);
					  }
    				break;
				case 3:
 					if(eqBass4 === 1) {
						  BehringerCmdPl1.deck[0].e5.led.on();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass4);

					  } else {
						  BehringerCmdPl1.deck[0].e5.led.off();
						  BehringerCmdPl1.deck[0].e5.led.level(0, 2.1, eqBass4);
					  }			

					   if(eqMid4 === 1) {
						  BehringerCmdPl1.deck[0].e6.led.on();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid4);

					  } else {
						  BehringerCmdPl1.deck[0].e6.led.off();
						  BehringerCmdPl1.deck[0].e6.led.level(0, 2.1, eqMid4);
					  }	

					  if(eqHigh4 === 1) {
						  BehringerCmdPl1.deck[0].e7.led.on();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh4);

					  } else {
						  BehringerCmdPl1.deck[0].e7.led.off();
						  BehringerCmdPl1.deck[0].e7.led.level(0, 2.1, eqHigh4);
					  }	

					  if(Gain4 === 1) {
						  BehringerCmdPl1.deck[0].e8.led.on();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain4);

					  } else {
						  BehringerCmdPl1.deck[0].e8.led.off();
						  BehringerCmdPl1.deck[0].e8.led.level(0, 2.1, Gain4);
					  }
					  break;
			}	

	 

	  if(filter1 === 0.5) {
		  BehringerCmdPl1.deck[0].e1.led.on();
	  } else {
		  BehringerCmdPl1.deck[0].e1.led.off();
		  BehringerCmdPl1.deck[0].e1.led.level(0, 1.1, filter1);
	  }

	  if(filter2 === 0.5) {
		  BehringerCmdPl1.deck[0].e2.led.on();
	  } else {
		  BehringerCmdPl1.deck[0].e2.led.off();
		  BehringerCmdPl1.deck[0].e2.led.level(0, 1.1, filter2);

	  }

	  if(filter3 === 0.5) {
		  BehringerCmdPl1.deck[0].e3.led.on();
	  } else {
		  BehringerCmdPl1.deck[0].e3.led.off();
		  BehringerCmdPl1.deck[0].e3.led.level(0, 1.1, filter3);

	  }
	  if(filter4 === 0.5) {
		  BehringerCmdPl1.deck[0].e4.led.on();
	  } else {
		  BehringerCmdPl1.deck[0].e4.led.off();
		  BehringerCmdPl1.deck[0].e4.led.level(0, 1.1, filter4);

	  }

	  	
  }


  function updateLoaded() {
		loadedDeck1 = engine.getValue('[Channel1]', 'track_loaded');
		loadedDeck2 = engine.getValue('[Channel2]', 'track_loaded');
		loadedDeck3 = engine.getValue('[Channel3]', 'track_loaded');
		loadedDeck4 = engine.getValue('[Channel4]', 'track_loaded');

		playDeck1 = engine.getValue('[Channel1]', 'play');
		playDeck2 = engine.getValue('[Channel2]', 'play');
		playDeck3 = engine.getValue('[Channel3]', 'play');
		playDeck4 = engine.getValue('[Channel4]', 'play');

		var loaded = [loadedDeck1, loadedDeck2, loadedDeck3, loadedDeck4];


		for (var ch = 0; ch < BehringerCmdPl1.deck.length; ch++){
			if(loadedDeck1 === 1) {
		    BehringerCmdPl1.deck[ch].b1.led.blink();
				if(playDeck1) BehringerCmdPl1.deck[ch].b1.led.on();
			} else {
		    BehringerCmdPl1.deck[ch].b1.led.off();
			}
		
			if(loadedDeck2 === 1) {
		    BehringerCmdPl1.deck[ch].b2.led.blink();
				if(playDeck2) BehringerCmdPl1.deck[ch].b2.led.on();
			} else {
		    BehringerCmdPl1.deck[ch].b2.led.off();
			}

			if(loadedDeck3 === 1) {
		    BehringerCmdPl1.deck[ch].b3.led.blink();
				if(playDeck3) BehringerCmdPl1.deck[ch].b3.led.on();
			} else {
		    BehringerCmdPl1.deck[ch].b3.led.off();
			}
		
			if(loadedDeck4 === 1) {
		    BehringerCmdPl1.deck[ch].b4.led.blink();
				if(playDeck4) BehringerCmdPl1.deck[ch].b4.led.on();
			} else {
		    BehringerCmdPl1.deck[ch].b4.led.off();
			}
		}
      
  }

  function enableScratch() {
    //engine.scratchEnable(1 + channel, 420, 30, .220, .00620);
        engine.scratchEnable(channel + 1, 600, 45+1/3, 1/8, (1/8)/32);
    deck.scratch.led.on();
  }

  function disableScratch() {
    deck.scratch.led.blink();
  }

  function connect(deck, ui, callback) {
    return engine.makeConnection(channelGroup, ui, callback);
  }

  function encoderReseter(control) {
    return function() {
      control.led.level(0);
      control.led.off();
    };
  }

  function buttonReseter(control) {
    return function() {
      control.led.off();
    }
  }

  // CONTROLLER GENERIC SETUP

  deck.e1.setup = deck.e1.release = encoderReseter(deck.e1);
  deck.e2.setup = deck.e2.release = encoderReseter(deck.e2);
  deck.e3.setup = deck.e3.release = encoderReseter(deck.e3);
  deck.e4.setup = deck.e4.release = encoderReseter(deck.e4);
  deck.e5.setup = deck.e5.release = encoderReseter(deck.e5);
  deck.e6.setup = deck.e6.release = encoderReseter(deck.e6);
  deck.e7.setup = deck.e7.release = encoderReseter(deck.e7);
  deck.e8.setup = deck.e8.release = encoderReseter(deck.e8);

  deck.b1.setup = deck.b1.release = buttonReseter(deck.b1);
  deck.b2.setup = deck.b2.release = buttonReseter(deck.b2);
  deck.b3.setup = deck.b3.release = buttonReseter(deck.b3);
  deck.b4.setup = deck.b4.release = buttonReseter(deck.b4);
  deck.b5.setup = deck.b5.release = buttonReseter(deck.b5);
  deck.b6.setup = deck.b6.release = buttonReseter(deck.b6);
  deck.b7.setup = deck.b7.release = buttonReseter(deck.b7);
  deck.b8.setup = deck.b8.release = buttonReseter(deck.b8);

  deck.load.setup = deck.load.release = buttonReseter(deck.load);
  deck.lock.setup = deck.lock.release = buttonReseter(deck.lock);
  deck.scratch.setup = deck.scratch.release = buttonReseter(deck.scratch);
  deck.sync.setup = deck.sync.release = buttonReseter(deck.sync);
  deck.tap.setup = deck.tap.release = buttonReseter(deck.tap);
  deck.cue.setup = deck.cue.release = buttonReseter(deck.cue);
  deck.backward.setup = deck.backward.release = buttonReseter(deck.backward);
  deck.forward.setup = deck.forward.release = buttonReseter(deck.forward);
  deck.minus.setup = deck.minus.release = buttonReseter(deck.minus);
  deck.plus.setup = deck.plus.release = buttonReseter(deck.plus);

}

var BehringerCmdPl1Custom = (function () {
  function main() {
    print('setting up custom Behringer CMD PL-1 decks');

	engine.softTakeover("[Channel1]", "rate", true);
engine.softTakeover("[Channel2]", "rate", true);
engine.softTakeover("[Channel3]", "rate", true);
engine.softTakeover("[Channel4]", "rate", true);


engine.setValue('[Channel1]', 'keylock', 0);
engine.setValue('[Channel2]', 'keylock', 0);
engine.setValue('[Channel3]', 'keylock', 0);
engine.setValue('[Channel4]', 'keylock', 0);



engine.setValue('[Channel1]', 'volume', 0);
engine.setValue('[Channel2]', 'volume', 0);
engine.setValue('[Channel3]', 'volume', 0);
engine.setValue('[Channel4]', 'volume', 0);








    for (var ch = 0; ch < BehringerCmdPl1.deck.length; ch++)
      myCustomDeck(ch, BehringerCmdPl1.deck[ch]);

    BehringerCmdPl1.init(); // forcing reloading
  }

  function kill() {
    print('releasing custom Behringer CMD PL-1 decks');
  }

  return { init: main, shutdown: kill };
})();
