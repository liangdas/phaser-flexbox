'use strict';
/**
 * Created by liangdas on 2017/7/30.
 * Email 1587790525@qq.com
 */
var extend = require('./utils/inherits.js');
var YogaLayout = require('./lib/yoga-layout');
var yoga=window.yoga;
module.exports =  extend(Phaser.Sprite, {
    ctor: function (game) {
        this._super(game,game.world.centerX, game.world.centerY,"bk");
        this.onWindowClose=new Phaser.Signal();
        this.onWindowOpen=new Phaser.Signal();
        this.onBtnStart=new Phaser.Signal();
        this.onBtnShare=new Phaser.Signal();
        this.anchor.set(0.5);


        this.btn_close = this.game.add.image(0,0 - 80,"btn_close");
        this.btn_close.initLayout=function (layerNode) {
            //Flexbox 布局配置，每一个元素，在调用calculateLayout之前都应该实现一个这样的函数
            layerNode.setPositionType(yoga.POSITION_TYPE_ABSOLUTE);
            layerNode.setPosition(yoga.EDGE_TOP,-30);   //距离父容器顶部 -30
            layerNode.setPosition(yoga.EDGE_RIGHT,80);  //距离父容器右边 80
            layerNode.setWidth(60);
            layerNode.setHeight(60);
        };

        this.btn_start = this.game.add.button(0, 0, 'btn_start', function () {
            this.onBtnStart.dispatch();
        }, this, 0, 0, 1);

        this.btn_start.initLayout=function (layerNode) {
            //Flexbox 布局配置，每一个元素，在调用calculateLayout之前都应该实现一个这样的函数
            layerNode.setPositionType(yoga.POSITION_TYPE_ABSOLUTE);
            layerNode.setPosition(yoga.EDGE_BOTTOM,-30);
            layerNode.setPosition(yoga.EDGE_LEFT,80);
            layerNode.setWidth(60);
            layerNode.setHeight(60);
        };

        this.btn_sitdown = this.game.add.button(0, 0, 'btn_sitdown', function () {
            this.onBtnStart.dispatch();
        }, this, 0, 0, 1);

        this.btn_sitdown.initLayout=function (layerNode) {
            //Flexbox 布局配置，每一个元素，在调用calculateLayout之前都应该实现一个这样的函数
            layerNode.setPositionType(yoga.POSITION_TYPE_ABSOLUTE);
            layerNode.setPosition(yoga.EDGE_BOTTOM,-30);      //距离父容器底部 -30
            layerNode.setPositionPercent(yoga.EDGE_RIGHT,50); //距离父容器右边 父容器宽度的50%
            layerNode.setWidth(60);
            layerNode.setHeight(60);
        };

        this.btn_share = this.game.add.button(0, 0, 'btn_share', function () {
            this.onBtnShare.dispatch();
        }, this, 0, 0, 1);

        this.btn_share.initLayout=function (layerNode) {
            layerNode.setPositionType(yoga.POSITION_TYPE_ABSOLUTE);
            layerNode.setPosition(yoga.EDGE_BOTTOM,-30);
            layerNode.setPosition(yoga.EDGE_RIGHT,80);
            layerNode.setWidth(60);
            layerNode.setHeight(60);
        };

        this.addChild(this.btn_close);      //加入父容器
        this.addChild(this.btn_start);
        this.addChild(this.btn_share);
        this.addChild(this.btn_sitdown);

        var yogaLayout=new YogaLayout();
        yogaLayout.enable(this);            //开启容器yoga功能
        this.yogaInsertChild(this.btn_close, 0);    //加入到父容器中，这个函数内会自动给这些子元素开启yoga
        this.yogaInsertChild(this.btn_start, 1);
        this.yogaInsertChild(this.btn_share, 2);
        this.yogaInsertChild(this.btn_sitdown, 3);

        this.calculateLayout(); //计算布局，通过这个函数就会调整容器以及其子元素的位置和距离了


        this.btn_close.inputEnabled=true;
        this.btn_close.events.onInputDown.add(function () {
            this.closeWindow();
        }, this);

        //默认是隐藏的
        this.scale.set(0);
        this.x=game.world.centerX;
        this.y=game.world.centerY;
        game.world.add(this);
        return this;
    },
    openWindow:function () {

        if ((this.tween && this.tween.isRunning) || this.scale.x === 1)
        {
            return;
        }

        //  Create a tween that will pop-open the window, but only if it's not already tweening or open
        this.tween = this.game.add.tween(this.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
        this.tween.onComplete.add(function () {
            this.onWindowOpen.dispatch();
        },this)
    },
    closeWindow:function () {

        if (this.tween.isRunning || this.scale.x === 0)
        {
            return;
        }

        //  Create a tween that will close the window, but only if it's not already tweening or closed
        this.tween = this.game.add.tween(this.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Elastic.In, true);
        this.tween.onComplete.add(function () {
            this.onWindowClose.dispatch();
        },this)

    },
    initLayout:function (layerNode) {
        //Flexbox 布局配置，每一个元素，在调用calculateLayout之前都应该实现一个这样的函数
        layerNode.setWidth(this.width);
        layerNode.setHeight(this.height);
        layerNode.setDisplay(yoga.DISPLAY_FLEX);
        layerNode.setFlexDirection(yoga.FLEX_DIRECTION_ROW);
        layerNode.setFlexWrap(yoga.WRAP_WRAP);
        layerNode.setAlignItems(yoga.ALIGN_CENTER);
        layerNode.setAlignContent(yoga.ALIGN_CENTER);
        layerNode.setJustifyContent(yoga.JUSTIFY_SPACE_AROUND);
    },
    destroy: function () {
        this._super();

        if (this.onWindowClose)           { this.onWindowClose.dispose(); }
        if (this.onWindowOpen)      { this.onWindowOpen.dispose(); }
        if (this.onBtnStart)  { this.onBtnStart.dispose(); }
        if (this.onBtnShare)  { this.onBtnShare.dispose(); }
    }
});