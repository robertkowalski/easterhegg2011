/*
Copyright (c) 2010, R. Kowalski
All rights reserved.


Redistribution and use in source and binary forms, 
with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, 
  this list of conditions and the following disclaimer.
  
* Redistributions in binary form must reproduce the above copyright notice, 
  this list of conditions and the following disclaimer in the documentation and/or other materials provided 
  with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/


function DayAssistant(response) {

    this.orientation = response.orientation;
    this.day = response.day;
    this.date = new Date();  
    this.chooseRoom = response.room;
    
 /*   
    $('title1').hide();
    $('title2').hide();
    $('title3').hide();   
*/
}

DayAssistant.prototype.setup = function() {
  
    this.controller.setupWidget(Mojo.Menu.appMenu, appMenuAttributes, appMenuModel); 

    var widget;
    var html = '';
    var k = 0;
    this.widArrayNames = [];
    var containerwidth=0;
    
    for(var i=0;i<Fahrplan.data[this.day].length;i++){
        this.menuModel = {
            items: Fahrplan.data[this.day][i]
        };
        widget = 'TimeWidget'+i;
        this.widArrayNames[i] = widget;
        this.controller.setupWidget(widget, {
                itemTemplate: "day/day-row-template",
                listTemplate: "day/day-list-template",
                swipeToDelete: false, 
                renderLimit: 50,
                reorderable: false
            },this.menuModel);
        
        k = i+1;
        html += '<div class="scrollerItem" id="scrollerItem:'+k+'">'+'<div style="" id="title'+k+'" class="palm-page-header multi-line">'+Fahrplan.data[this.day][i][0].roomname+'</div>'+'<div style="padding-bottom:65px;" x-mojo-element="List" id="TimeWidget'+i+'"></div>'+'</div>';
       
    }	
    containerwidth = Fahrplan.data[this.day].length*320;
    $('container').setStyle({
        width: containerwidth+'px'
    });
    
    $('parseWidget').update(html);
    
    this.controller.setupWidget("scrollerId", {
                            mode: 'horizontal-snap'
                            }, this.model = {
                            snapElements: { x: $$('.scrollerItem') },
                            snapIndex: 0
                            });

    this.orientationBinder = this.handleOrientation.bindAsEventListener(this);
    this.controller.listen(this.controller.document, "orientationchange", this.orientationBinder);  
   
};



DayAssistant.prototype.activate = function(event) {
    
    this.widArrayRef = [];
    for(i=0;i<this.widArrayNames.length;i++){
        this.widArrayRef[i] = this.controller.get("TimeWidget"+i);
    }

    this.getStartupOrientation();
    
    //make bubble tapable	
    this.showDetails();  
    
};


DayAssistant.prototype.deactivate = function(event) {	

    for (i = 0; i < this.widArrayRef.length; i++) {
        this.controller.stopListening(this.widArrayRef[i], Mojo.Event.listTap, this.openDetailWithIdBind[i]);
    }
};


DayAssistant.prototype.cleanup = function(event) {
    
    for (i = 0; i < this.widArrayRef.length; i++) {
        this.controller.stopListening(this.widArrayRef[i], Mojo.Event.listTap, this.openDetailWithIdBind[i]);
    }
    this.controller.stopListening(document, "orientationchange", this.orientationBinder);      
};

DayAssistant.prototype.getStartupOrientation = function () {
        
    var orient = this.controller.stageController.getWindowOrientation();

    switch(orient){
        case "up":
        case "down":
            this.setPortraitClasses();
            this.showTitles();
        break;
        //landscape
        case "left":
        case "right":
            this.setLandscapeClasses();
            this.showTitles();
        break;   
    }
};


DayAssistant.prototype.handleOrientation = function (event) {
       
    switch(event.position){
        case 2:
        case 3:		    
            this.hideTitles();
            this.setPortrait();
            this.setPortraitClasses();
        break;
        //landscape
        case 4:
        case 5:
            this.hideTitles();
            this.setLandscape();  
            //this.setLandscapeClasses();       
        break;   
    }
};

DayAssistant.prototype.setLandscape = function(){
    
    
    if (OrientationHelper.last != 'landscape') {
        
        this.setLandscapeClasses();
    //make bubbles longer
        for (var room = 0; room < Fahrplan.data[this.day].length; room++) {
            for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) * 2;
            }
        }
        
        this.newMenuModel = [];
        for(i=0;i<this.widArrayRef.length;i++){
            this.newMenuModel[i] = {
                items: Fahrplan.data[this.day][i]
            };

            this.controller.setWidgetModel(this.widArrayRef[i], this.newMenuModel[i]);
        }

    }
    this.showTitles();
    OrientationHelper.last = 'landscape'; 
    
};  

DayAssistant.prototype.setPortrait = function(){
    
    
    if(OrientationHelper.last != 'portrait'){
        
        for (var room = 0; room < Fahrplan.data[this.day].length; room++) {
            for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) / 2;
            }
        }
       
        this.newMenuModel = [];
        for(i=0;i<this.widArrayRef.length;i++){
            this.newMenuModel[i] = {
                items: Fahrplan.data[this.day][i]
            };

            this.controller.setWidgetModel(this.widArrayRef[i], this.newMenuModel[i]);
        }

    }
    this.showTitles();
    OrientationHelper.last = 'portrait';  
    
};  


DayAssistant.prototype.setLandscapeClasses = function(){

    var i, k = 0;
    var name, width;
    for(i=0;i<this.widArrayRef.length;i++){
        k = i+1;
        name = 'scrollerItem:'+k;
        
        $(name).removeClassName('portrait');
        $(name).addClassName('landscape');
    }
    

    var containerWidth = 160*this.widArrayRef.length;
    $('container').setStyle({
        width: containerWidth+'px'
    });
    
}    

DayAssistant.prototype.setPortraitClasses = function() {
  
    var k = 0;
    var name;
    for(i=0;i<this.widArrayRef.length;i++){
        k = i+1;
        name = 'scrollerItem:'+k;
        $(name).addClassName('portrait');
        $(name).removeClassName('landscape');
    }
    containerwidth = Fahrplan.data[this.day].length*320;
    $('container').setStyle({
        width: containerwidth+'px'
    });

}

DayAssistant.prototype.showTitles = function() {
 /*   
    $('title1').show();
    $('title2').show();
    $('title3').show(); 
    */
}
DayAssistant.prototype.hideTitles = function() {
/*
    $('title1').hide();
    $('title2').hide();
    $('title3').hide();
    */
}

/*
DayAssistant.prototype.chooseSaal = function() {

    var thisHour = this.date.getHours();   
    var countroom;
    
    for (countroom = 2; countroom > -1; countroom--) {
        for (i = 0; i < Fahrplan.data[this.day][countroom].length; i++) {
            if (Fahrplan.data[this.day][countroom][i].hourid == thisHour) {
                this.chooseRoom = countroom;
                this.timeID = i;
                break;
            }
        }
        if (this.timeID) {
            break;
        }    
    } //max 2hrs for next events if currently no event
    
    if(!this.timeID){
        thisHour = thisHour+1;
        for (countroom = 2; countroom > -1; countroom--) {
            for (i = 0; i < Fahrplan.data[this.day][countroom].length; i++) { 
                if (Fahrplan.data[this.day][countroom][i].hourid == thisHour) {
                    this.chooseRoom = countroom;
                    this.timeID = Fahrplan.data[this.day][countroom][i].hourid;
                }
            }
        }
    }	
    if(!this.timeID){
        thisHour = thisHour+2;
        for (countroom = 2; countroom > -1; countroom--) {
            for (i = 0; i < Fahrplan.data[this.day][countroom].length; i++) { 
                if (Fahrplan.data[this.day][countroom][i].hourid == thisHour) {
                    this.chooseRoom = countroom;
                    this.timeID = Fahrplan.data[this.day][countroom][i].hourid;
                }
            }
        }
    }	
//   Mojo.Log.error('timeid: '+this.timeID);
    if (this.timeID) {	

        this.revealItem(this.timeID,this.chooseRoom);
    }	
            
};


DayAssistant.prototype.revealItem = function(timeID, room) {	

    this.controller.setWidgetModel(this.timewidget0, this.newMenuModel[0]);
    this.timewidget0.mojo.revealItem(timeID, false);
  
};
*/

DayAssistant.prototype.showDetails = function(){

    this.openDetailWithIdBind = [];
    for (i = 0; i < this.widArrayRef.length; i++) {
        this.openDetailWithIdBind[i] = this.openDetailWithId.bindAsEventListener(this, i);
        this.controller.listen(this.widArrayRef[i], Mojo.Event.listTap, this.openDetailWithIdBind[i]);
    }
    
};


DayAssistant.prototype.openDetailWithId = function(event, room){
        
    if (Fahrplan.data[this.day][room][event.index].color != 'transparent') {

        Mojo.Controller.stageController.pushScene({
            name: 'detail'
        }, {
            day: this.day,
            room: room,
            detailid: event.index
           
        });
    
    }
};
