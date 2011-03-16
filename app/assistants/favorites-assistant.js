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

function FavoritesAssistant() {
}

FavoritesAssistant.prototype.setup = function() {

    this.appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, 
        {
            label: $L("Help"),
            command: "do-helpAddSub"
        }   
        
        ]
    };
    this.controller.setupWidget(Mojo.Menu.appMenu, appMenuAttributes, this.appMenuModel); 

    
    this.testmodel = []; 
    this.testmodel[0] = [];
    this.testmodel[0]['title'] = 'No Favorites saved';
    this.menuModel = {
            items: this.testmodel
    };
    
    this.controller.setupWidget("FavWidget", {
            itemTemplate: "favorites/favorites-row-template",
            listTemplate: "favorites/favorites-list-template",
            swipeToDelete: false, 
            renderLimit: 50,
            reorderable: false
        },this.menuModel);  
    
    this.favwidget = this.controller.get("FavWidget"); 
    
    //this.controller.listen(this.controller.document, 'orientationchange', this.orientationBinder);  
};


FavoritesAssistant.prototype.activate = function(event) {
    DBAss.readFavs(this.processResults.bind(this)); 
};

FavoritesAssistant.prototype.deactivate = function(event) {
    if (this.favmodel[0]['title'] != 'No Bookmarks saved') {
        Mojo.Event.stopListening(this.favwidget, Mojo.Event.listTap, this.openDetailWithIdBind);
    }
};

FavoritesAssistant.prototype.cleanup = function(event) {
    //this.controller.stopListening(this.controller.document, 'orientationchange',  this.orientationBinder);
};

FavoritesAssistant.prototype.processResults = function(inResults){

    this.controller.setupWidget(Mojo.Menu.appMenu, appMenuAttributes, appMenuModel);

    this.favmodel = [];

    if (inResults.length > 0) {
        
        for (var i = 0; i < inResults.length; i++) {
     
           this.favmodel[i] =[];
           this.favmodel[i]['eventid'] = inResults[i].eventid;

           for (var day = 0; day < Fahrplan.data.length; day++) {
               for (var room = 0; room < Fahrplan.data[day].length; room++) {
                   for (var j = 0; j < Fahrplan.data[day][room].length; j++) {
                       if(Fahrplan.data[day][room][j].id == inResults[i].eventid){
                           this.favmodel[i]['title'] = Fahrplan.data[day][room][j].title;
                           this.favmodel[i]['feedback'] = 'immediate';
                           this.favmodel[i]['day'] = day;
                           this.favmodel[i]['room'] = room;
                           break;
                       }
                   }   
               }
           }  
        }
    } else {
        this.favmodel[0] =[];
        this.favmodel[0]['title'] = 'No Bookmarks saved';
        this.favmodel[0]['feedback'] = 'none';
        
    }
    this.menuModel = {
        items: this.favmodel
    };
  //  Mojo.Log.error('eventindex'+inResults[i].eventindex);
     
    this.controller.setWidgetModel(this.favwidget, this.menuModel);
    this.controller.modelChanged(this.menuModel);
    
    if (this.favmodel[0]['title'] != 'No Bookmarks saved') {
        this.openDetailWithIdBind = this.handleTap.bindAsEventListener(this); //PRE-CACHE//
        this.controller.listen(this.favwidget, Mojo.Event.listTap, this.openDetailWithIdBind);
    }
}

FavoritesAssistant.prototype.handleTap = function(event){
   
   var day, room = 0;
   var eventid = this.favmodel[event.index]['eventid'];
   for (day = 0; day < Fahrplan.data.length; day++) {
       for (room = 0; room < Fahrplan.data[day].length; room++) {
           for (i = 0; i < Fahrplan.data[day][room].length; i++) {
               if(Fahrplan.data[day][room][i].id == eventid){
                   this.day = day;
                   this.room = room;
                   this.eventindex = i;
                   break;
               }
           }   
       }
   }
   
   Mojo.Controller.stageController.pushScene({
            name: 'detail'
        }, {
            day: this.day,
            room: this.room,
            detailid: this.eventindex
        });

}    

// START orientation handling //
FavoritesAssistant.prototype.handleOrientation = function (event) {

       
    switch(event.position){
        case 2:
        case 3:
            this.setPortrait();
        break;
        //landscape
        case 4:
        case 5:
            this.setLandscape();   
        break;   
    }
};

FavoritesAssistant.prototype.setLandscape = function(){
    
    if (OrientationHelper.last != 'landscape') {
    
        //make bubbles longer
    for (this.day = 0; this.day < Fahrplan.data.length; this.day++) {
            for (var room = 0; room < 3; room++) {
                for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                    Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) * 2;
                }
            }
        }
    }
    OrientationHelper.last = 'landscape'; 

};  

FavoritesAssistant.prototype.setPortrait = function(){
    
    if(OrientationHelper.last != 'portrait'){
        for (this.day = 0; this.day < Fahrplan.data.length; this.day++) {
            for (var room = 0; room < 3; room++) {
                for (var i = 0; i < Fahrplan.data[this.day][room].length; i++) {
                    Fahrplan.data[this.day][room][i].duration = Number(Fahrplan.data[this.day][room][i].duration) / 2;
                }
            }
        }    
    }
    OrientationHelper.last = 'portrait';  
    
};  
// END orientation handling //