// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://steamcommunity.com/profiles/76561198320810968
// @version      1.8
// @description  A script for owners of bots on gladiator.tf
// @author       manic
// @grant    GM.getValue
// @grant    GM.setValue
// @license      MIT

// @homepageURL     https://github.com/mninc/gladiator.tf-bot-owner-script
// @supportURL      https://github.com/mninc/gladiator.tf-bot-owner-script/issues
// @downloadURL     https://github.com/mninc/gladiator.tf-bot-owner-script/raw/master/gladiator.user.js

// @run-at       document-end
// @include      /^https?:\/\/(.*\.)?((backpack)|(gladiator))\.tf(:\d+)?\//
// ==/UserScript==

let buttons = {};

(function() {
    'use strict';
    
    switch(window.origin){
        case 'https://gladiator.tf':
            gladiator(); 
            break;
        case 'https://backpack.tf':
            buttons = {
                addAll: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all</a>`),
                addAllPriced: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all priced unusuals</a>`),
                addAllUnPriced: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all unpriced unusuals</a>`),
                check: $(`<div class="" target="_blank"><input type="checkbox" id="store-check">Store to Add Later</div>`)
            }
            backpack();
            break;
    }
    
})();

function backpack(){
    for (let i of document.getElementsByClassName('price-box')) {
        if (i.origin === 'https://gladiator.tf') { 
          return;
        }
    }
    

    if (window.location.href.includes('https://backpack.tf/effect/')){
        let check;
        appendCheck(".panel-body > .padded");
        $(".panel-body > .padded").append(buttons.addAll);

        buttons.addAll.on("click", ()=>{
            check = buttons.check.find("input").val();
            addItems("#unusual-pricelist > li", check)
        });
    }
    if (window.location.href.includes('https://backpack.tf/unusual/')){

        let check;

        appendCheck(".panel-body > .padded");
        $(".panel-body > .padded").append(buttons.addAll);
        $(".panel-body > .padded").append(buttons.addAllPriced);
        $(".panel-body > .padded").append(buttons.addAUnPriced);

        buttons.addAll.on("click", ()=>{
            check = buttons.check.find("input").val();
            addItems(".item-list.unusual-pricelist > li, .item-list.unusual-pricelist-missing > li", check)
        });
        buttons.addAllPriced.on("click", ()=>{
            check = buttons.check.find("input").val();
            addItems(".item-list.unusual-pricelist > li", check);
        });
        buttons.addAllUnPriced.on("click", ()=>{
            check = buttons.check.find("input").val();
            addItems(".item-list.unusual-pricelist-missing > li", check)
        });
    }
    if (window.location.href.includes('/stats')) {
        $('.price-boxes').append(
            `<a class="price-box" href="https://gladiator.tf/manage/my/item/${encodeURIComponent($('.stats-header-title').text().trim())}/add" target="_blank" data-tip="top" data-original-title="Gladiator.tf">
                <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
                <div class="text" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 0;">
                    <div class="value" style="font-size: 14px;">Add on Gladiator.tf</div>
                </div>
            </a>`);
    }

    $("body").on("mouseover", ".item", function () {
        let self = this;
        let id = setInterval(function() {
            if ($(self).next().hasClass("popover")) {
                let popover = $(self).next().find("#popover-price-links");

                if (popover.find("a[href^='https://gladiator.tf']").length == 0) {
                    popover.append("<a class=\"btn btn-default btn-xs\" href=\"" + `https://gladiator.tf/manage/my/item/${encodeURIComponent($($(self)[0]).data('original-title'))}/add` + "\" target=\"_blank\"><img src=\"https://gladiator.tf/favicon-96x96.png\" style='width: 16px;height: 16px;margin-top: -2px;'> Add on Gladiator.tf</a>");
                }

                clearInterval(id);
            }
        }, 50);
        setTimeout(function () {
            clearInterval(id);
        }, 750);
    });

    
}


/**
 * Add items in bulk
 * @param {string | Array} input CSS selector of items to add or array of pre-made items to add 
 * @param {boolean} redirect True if extension is to redirect after adding the items 
 */
function addItems(input, redirect = true){
    let items = [];
    if($(input).length > 0){
        console.log("input");
        $(input).each(function(){
            items.push(parseItemListItem($(this)));
        });
        mergeAndAdd(items);
    }else if(Array.isArray(input)){
        
    }else{
        console.log("none");
    }
}

async function appendCheck(selector){
    $(selector).append(buttons.check);
    if(new Boolean(await GM.getValue("check", false))){
        buttons.check.click();
    }
    buttons.check.on("click", function(){
        GM.setValue("check", $(this).val());
    })
}

async function mergeAndAdd(newItems){
    GM.getValue("items", "[]").then((val)=>{
        GM.setValue("items", [...val, ...newItems]);
        console.log([...val, ...newItems]);
    });
}

function parseItemListItem($item){
    let quality = $item.data("q_name");
    let effect_id = $item.data("effect_id");
    let craftable = $item.data("craftable");
    let name = $item.prop("title") || $item.data("original-title");
    let pathToImg = "";
    
    if($item.find(".item-icon").length){
        let background_image = /(?<=url\().*?(?=\))/.exec($item.find(".item-icon").css("background-image"));
        pathToImg = background_image.shift();
    }

    return {
        quality,
        effect_id,
        craftable,
        name,
        pathToImg
    }
}

async function gladiator(){
    let itemsBulk = /gladiator\.tf(:\d+)?\/manage\/\w*\/items\/bulk/;
    if(itemsBulk.test(window.location.href)){
       let storage =  await GM.getValue("items", "[]");
       if(storage.length > 2){
           $("#tm-input").val(storage).trigger("input");
       }
    }
}
