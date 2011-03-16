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

function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    
    this.controller.pushScene("first");
    
    appMenuAttributes = {
        omitDefaultItems: true
    };
    appMenuModel = {
        visible: true,
        items: [Mojo.Menu.editItem, 
        {
            label: $L("Bookmarks"),
            command: 'do-Favs'
        },
        {
            label: $L("Help"),
            command: "do-helpAddSub"
        }
        ]
    };

    
};



StageAssistant.prototype.handleCommand = function(event) {
    
    var currentScene = this.controller.activeScene();
    if(event.type == Mojo.Event.command) {
        switch(event.command) {
            case 'do-About':
                currentScene.showAlertDialog({
                    onChoose: function(value) {},
                    title:  Mojo.Controller.appInfo.title + ' - v' + Mojo.Controller.appInfo.version,
                    message: '&copy; 2010, R. Kowalski & nono'+'<div><br>This App has no <br></br>super-pyramide-powers.</br></div>',
                    choices:[
                    {label: "OK", value:""}
                    ],
                    allowHTMLMessage: true
                });
            break;
            case 'do-helpAddSub':
                this.controller.pushScene("help");
            break; 
            case 'do-Favs':
                this.controller.pushScene("favorites");
            break; 
        }
    }
};