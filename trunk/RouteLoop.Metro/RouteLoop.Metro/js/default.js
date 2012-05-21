// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";

    var app = WinJS.Application;

    var myData = [];
    myData.list = new WinJS.Binding.List();
    myData.groupedList = myData.list.createGrouped(getGroupKey, getGroupData, compareGroups);

    function compareGroups(left, right) {
        return -1;
    }

    function getGroupKey(dataItem) {
        return dataItem.group.title;
    }

    function getGroupData(dataItem) {
        return {
            key: dataItem.group.key,
            title: dataItem.group.title,
        };
    }

    function itemInvoked(eventObject) {
        document.querySelector('.levelGrid').style.display = "none";
        var theCanvas = document.querySelector('#canvas');
                var item = eventObject.detail.itemPromise._value.data;

        startingLevel = item.group.key;

        g_game = new Game();
        g_game.startGame();

        document.querySelector("#backButton").style.display = 'inline';

        theCanvas.style.display = "inline";
        WinJS.UI.Animation.enterPage([theCanvas], { top: "0px", left: "-800px" }).then(function () {
                }, function () { })
    }

    function GetBackPicPath(enviroment) {
        switch (enviroment) {
            case 1:
                return "/images/cemento.png";
            case 2:
                return "/images/grass.png"
            case 3:
                return "/images/caves.png"
            case 4:
                return "/images/pac.png"
        }
    }

    function GetLevelType(type) {
        switch (type) {
            case 1:
                return "Easy";
            case 2:
                return "Medium";
            case 3:
                return "Hard";
            case 4:
                return "Impossible";
        }
    }

    function GetBackColorPath(enviroment) {
        switch (enviroment) {
            case 1:
                return "#b6ff00";
            case 2:
                return "#ffd800"
            case 3:
                return "#b200ff"
            case 4:
                return "#ff006e"
        }
    }

    function _viewstatechanged(eventObject) {
        if (eventObject.viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
            if (g_game) {
                g_game.pause();
                document.querySelector('#backButton').style.display = 'none';
                document.querySelector('#canvas').style.display = 'none';
            } else {
                document.querySelector('.levelGrid').style.display = 'none';
            }

            document.querySelector('#snappedMessage').style.display = 'block';
        } else {
            if (g_game) {
                g_game.resume();
                document.querySelector('#backButton').style.display = 'inline';
                document.querySelector('#canvas').style.display = 'inline';
            } else {
                document.querySelector('.levelGrid').style.display = 'block';

                //var levelGrid = document.querySelector('.levelGrid').winControl;

                //if (eventObject.viewState === 3) {
                //    levelGrid.layout = new WinJS.UI.ListLayout();
                //} else {
                //    levelGrid.layout = new WinJS.UI.GridLayout({ groupHeaderPosition: "top" });
                //}
            }

            document.querySelector('#snappedMessage').style.display = 'none';
        }
    }

    function blurHandler(e) {
        if (g_game) {
            g_game.pause();
        }
    }

    function focusHandler(e) {
        if (g_game) {
            if (Windows.UI.ViewManagement.ApplicationView.value === Windows.UI.ViewManagement.ApplicationViewState.fullScreenLandscape) {
                g_game.resume();
            }
        }
    }

    function windowResized(e) {
        var c = document.getElementById("canvas");

        //var cWidth = 640;
        //var cHeight = 480;
        //var canvasRatio = cWidth / cHeight;

        screenHeight = window.outerHeight;
        screenWidth = window.outerWidth;
        //var screenRatio = screenWidth / screenHeight;

        //if (screenRatio > canvasRatio) {
        //    c.height = cWidth / screenRatio;
        //    c.width = cWidth;
        //} else {
        //    c.height = cHeight;
        //    c.width = cHeight * screenRatio;
        //}
        
        scaleFactorY = c.height / screenHeight;
        scaleFactorX = c.width / screenWidth;
    }

    app.onactivated = function (eventObject) {
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize 
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension. 
                // Restore application state here.
            }
            WinJS.UI.processAll().then(function (e) {
                screenHeight = window.outerHeight;
                screenWidth = window.outerWidth;

                //Windows.Graphics.Display.DisplayProperties.autoRotationPreferences = Windows.Graphics.Display.DisplayOrientations.landscape;

                var appView = Windows.UI.ViewManagement.ApplicationView;
                appView.getForCurrentView().onviewstatechanged = _viewstatechanged.bind(this);

                window.addEventListener("blur", blurHandler, false);
                window.addEventListener("focus", focusHandler, false);
                window.addEventListener("resize", windowResized, false);

                backButton.addEventListener("click", function () {
                    GoBack();
                }, false);

                var levelGrid = document.querySelector('.levelGrid').winControl;
                WinJS.UI.setOptions(levelGrid, {
                    itemDataSource: myData.groupedList.dataSource,
                    itemTemplate: document.querySelector('.itemtemplate'),
                    groupHeaderTemplate: document.querySelector('.headerTemplate'),
                    groupDataSource: myData.groupedList.groups.dataSource,
                    oniteminvoked: itemInvoked.bind(this),
                    layout: new WinJS.UI.GridLayout({ groupHeaderPosition: "top" }),
                });

                for (var i = 0; i < levels.length; i++) {
                    myData.list.push({
                        group: {
                            key: i,
                            title: "Track " + (i + 1)
                        },
                        totalGas: levels[i].fuelsToGoal,
                        levelType: GetLevelType(levels[i].levelType),
                        levelbackground: GetBackPicPath(levels[i].levelTile + 1),
                        backgroundColor: GetBackColorPath(levels[i].levelTile + 1)
                    });
                }
            });
        }
    };

    app.oncheckpoint = function (eventObject) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the 
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise(). 
    };

    app.start();
})();

function GoBack() {
    g_game.destroy();
    g_game = null;

    var theCanvas = document.querySelector('#canvas');
    var theGrid = document.querySelector('.levelGrid');

    WinJS.UI.Animation.exitContent([theCanvas], { top: "0px", left: "-800px" }).then(function () {
        theCanvas.style.display = "none";

        document.querySelector("#backButton").style.display = 'none';
        //document.querySelector('#superContainer').style.backgroundImage = "url(/resources/fondomenu3.png)";

        theGrid.style.display = "block";
        WinJS.UI.Animation.fadeIn(theGrid);

    }, function () { })
}