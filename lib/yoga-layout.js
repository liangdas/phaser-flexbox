'use strict';
/**
 * Created by liangdas on 2017/4/26.
 * Email 1587790525@qq.com
 */
var extend = require('../utils/inherits.js');
var yoga=window.yoga;
module.exports=extend(function () {},{
    ctor:function () {
    },
    enable:function (object) {
        var self=this;
        if(object.yoga==null){
            object.yogahash = [];
            Object.defineProperty(object, "yoga", {
                get: function () {
                    if(this._yoga==null){
                        var layerNode = yoga.Node.create();
                        object.yoga=layerNode;
                        if(object.initLayout==null){
                            object.initLayout=function (layerNode) {
                                layerNode.setWidth(object.width);
                                layerNode.setHeight(object.height);
                                layerNode.setBorder(yoga.EDGE_ALL,1);
                            }
                        }
                        object.initLayout.call(object,layerNode);
                    }
                    return this._yoga;
                },
                set:function (yoga) {
                    this._yoga=yoga;
                }
            });

            //刷新布局
            object.calculateLayout=function () {
                if(this.yoga.getParent()==null){
                    //只在根路径调用就行
                    this.yoga.calculateLayout(this.width, this.height, yoga.DIRECTION_RTL);
                }
                this.mutatorsLayout();
            }.bind(object);
            //修改布局
            object.mutatorsLayout =function () {
                var parentNode=this.yoga.getParent();
                if((parentNode!=null)&&(this.yogaParent!=null)){
                    if (this.yogaParent instanceof Phaser.Group)
                    {
                        this.x=parentNode.getComputedLeft()+this.yoga.getComputedLeft();
                        this.y=parentNode.getComputedTop()+this.yoga.getComputedTop();
                    }
                    else {
                        this.x = parentNode.getComputedLeft() + this.yoga.getComputedLeft() - this.yogaParent.anchor.x * parentNode.getComputedWidth();
                        this.y = parentNode.getComputedTop() + this.yoga.getComputedTop() - this.yogaParent.anchor.y * parentNode.getComputedHeight();
                    }
                }else{
                    this.x=this.yoga.getComputedLeft();
                    this.y=this.yoga.getComputedTop();
                }
                this.width=this.yoga.getComputedWidth();
                this.height=this.yoga.getComputedHeight();

                for(var i in object.yogahash){
                    var child=object.yogahash[i];
                    child.mutatorsLayout();
                }
            }.bind(object);

            object.yogaInsertChild=function(childObject,index){
                self.enable(childObject);
                this.yoga.insertChild(childObject.yoga,index);
                this.addToYogaHash(childObject);
            }.bind(object);
            object.yogaDestroy=function(){
                self.destroy(this);
            }.bind(object);

            /**
             * Adds a child of this Group into the hash array.
             * This call will return false if the child is not a child of this Group, or is already in the hash.
             *
             * @method Phaser.Group#addToHash
             * @param {DisplayObject} child - The display object to add to this Groups hash. Must be a member of this Group already and not present in the hash.
             * @return {boolean} True if the child was successfully added to the hash, otherwise false.
             */
            object.addToYogaHash = function (child) {

                var index = this.yogahash.indexOf(child);

                if (index === -1)
                {
                    child.yogaParent=this;
                    this.yogahash.push(child);
                    return true;
                }

                return false;

            }.bind(object);

            /**
             * Removes a child of this Group from the hash array.
             * This call will return false if the child is not in the hash.
             *
             * @method Phaser.Group#removeFromHash
             * @param {DisplayObject} child - The display object to remove from this Groups hash. Must be a member of this Group and in the hash.
             * @return {boolean} True if the child was successfully removed from the hash, otherwise false.
             */
            object.removeFromYogaHash = function (child) {

                if (child)
                {
                    var index = this.yogahash.indexOf(child);

                    if (index !== -1)
                    {
                        child.yogaParent=null;
                        this.yogahash.splice(index, 1);
                        return true;
                    }
                }

                return false;

            }.bind(object);
        }
    },
    destroy:function(object){
        if(object.yoga!=null){
            for(var i in object.yogahash){
                var child=object.yogahash[i];
                object.yoga.removeChild(child.yoga);
                object.removeFromYogaHash(child);
                this.destroy(child);
            }
            yoga.Node.destroy(object.yoga);
            object.yoga=null;
        }
    }
});