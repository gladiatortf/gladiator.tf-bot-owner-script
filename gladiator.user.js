// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://steamcommunity.com/profiles/76561198320810968
// @version      1.13
// @description  A script for owners of bots on gladiator.tf
// @author       manic, moder112
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @connect      gladiator.tf
// @license      MIT

// @homepageURL     https://github.com/mninc/gladiator.tf-bot-owner-script
// @supportURL      https://github.com/mninc/gladiator.tf-bot-owner-script/issues
// @downloadURL     https://github.com/mninc/gladiator.tf-bot-owner-script/raw/master/gladiator.user.js

// @run-at       document-end
// @include      /(^https?:\/\/(.*\.)?((backpack\.tf)|(gladiator\.tf)|(backpacktf\.trade))(:\d+)?\/)/
// ==/UserScript==

// Domain is defined, so it can be easily replaced with localhost for dev.
var GLAD_DOMAIN = "gladiator.tf"

const svg = {
    options: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.2 37">
    <path d="m19.7 0-6.4 1.8L15.7 7l-.6.4-.5.2a16.9 16.9 0 0 0-3.4 2.5l-4-4.4-4 5 5 3-.5.8A18.2 18.2 0 0 0 6 19.2v.2L.3 18 0 24.7l5.8-.5a16.4 16.4 0 0 0 1.2 5l-5.4 2.3L5 37l5.8-4.7 3.5-2.8v-.1l-.2-.3-.4-.5a9.6 9.6 0 0 1-1-1.8 10.3 10.3 0 0 1-.8-3 8 8 0 0 1 0-1.9v-.3l.1-1c.2-1 .5-2 1.1-3l.4-.6c.2-.5.5-.9.8-1.2h.1a15.6 15.6 0 0 1 2.2-2.2 16 16 0 0 1 1.7-1 9.8 9.8 0 0 1 2-.7l.8-.1h.1l1-.1a13.2 13.2 0 0 1 4 .6h.2l1.1.5h.3l1-1.9 4.5-8.5-6-2.1L26 6a16.8 16.8 0 0 0-5.6-.2L19.7 0z"/>
    <path d="M19.2 12.9c-.9.3-1.7.8-2.5 1.3a10.4 10.4 0 0 0-3.2 3.6 10 10 0 0 0-1.2 4.9 9.9 9.9 0 0 0 1.2 4.8 10.3 10.3 0 0 0 3.2 3.5 9.5 9.5 0 0 0 2.5 1.3c.9.3 1.8.5 2.8.5h1a8 8 0 0 0 2.8-.5 12.4 12.4 0 0 0 4-2.6V22h-5.9l-2.6 3.5H25v2a5 5 0 0 1-2.3.6h-.3a6.2 6.2 0 0 1-2-.4 5 5 0 0 1-3-3 6.3 6.3 0 0 1 0-4.2c.3-.7.7-1.3 1.2-1.8a6.6 6.6 0 0 1 1.9-1.3c.7-.4 1.4-.5 2.2-.5l1.5.1-1.4 1.7h4.3l2.7-3.3a9.6 9.6 0 0 0-6.5-3.1 8.3 8.3 0 0 0-4 .6Z" data-name="Layer 1"/>
  </svg>
  `
}

const css = {
    bptf: `
        .li-gladiator-options a {
            display: flex!important;
            align-items: center;
            justify-content: flex-start;
        }
        .li-gladiator-options svg{
            width: 1.25em;
            height: 1.25em;
            margin-right: 3px;
        }
        .li-gladiator-options path {
            fill: #333;
        }
        .gladiatortf-add > div {
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            cursor:pointer; 
            margin-top: 0;
        }
        @media (max-width: 958.999px){
            path {
                fill: #888!important;
            }
        }
    `
}

/** @typedef {{ bots: Bots, lastCache: Date, manageContext: string }} SettingsData */

/** @typedef { Object<string, string> } Bots */

const Settings = {
    /** @type {SettingsData} */
    data: {
        manageContext: 'my',
        lastCache: new Date().setDate(new Date().getDate() - 1),
        bots: {}
    },
    /** @returns {Promise<SettingsData>} */
    load: ()=>{
        return new Promise((resolve)=>{
            GM.getValue('settings', JSON.stringify(Settings.data)).then((settings)=>{
                const parsed = JSON.parse(settings);
                Settings.data = Object.assign(Settings.data, parsed);
                resolve(parsed);
            })
        });
    },
    save: ()=>{
        GM.setValue('settings', JSON.stringify(Settings.data));
        console.log(Settings.data);
    },
    form: {
        render: ()=>{
            const $parent = $("<form id='glad-settings'></form>");
        
            const botAmount = Object.keys(Settings.data.bots).length;
            const $select = $("<select id='manageContext' name='manageContext' class='form-control'></select>");
            console.log(Settings.data.bots);
            console.log(Object.entries(Settings.data.bots));
            Object.entries(Settings.data.bots).forEach((bot)=>{
                $select.append(`<option value="${bot[1]}" ${Settings.data.manageContext === bot[1] ? 'selected' : ''}>${bot[0]}</option>`)
            })
        
            const $bots = $(`<div class="form-group">
                                <label for="manageContext">Choose Your Bot</label>
                            </div>`);

            (botAmount > 0 ? $select : $(`<span>You dont have any bots</span>`)).insertAfter($bots.find("label"));
            $parent.append($bots);
        
            return $parent;
        },
        submit: ()=>{
            const formArray = $('#glad-settings').serializeArray();
            let formData = {};
            formArray.forEach((entry)=>formData[entry.name] = entry.value);

            Settings.data.manageContext = formData['manageContext'] ? formData['manageContext'] : 'my';
            Settings.save();
        }
    },
    updateBotData: ()=>{

        if(new Date(Settings.data.lastCache).getDate() === new Date().getDate()) {
            console.log('less than a day passed');
            return;
        }

        /** @returns {Promise<Bots>} */
        function fetchBotData(){
            return new Promise((resolve, reject)=>{
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://${GLAD_DOMAIN}/api/bots/my`,
                    onload: function (data) {
                        console.log('return');
                        data = JSON.parse(data.responseText);
                        if (!data.success) return reject(data);
            
                        let bots = data.bots;
                        resolve(bots);
                    },
                    onerror: reject
                });
            });
        }

        fetchBotData().then((bots)=>{
            Settings.data.bots = bots;
            Settings.data.lastCache = new Date();
            
            if(Object.keys(bots).length > 0 && Settings.data.manageContext === 'my'){
                Settings.data.manageContext = bots[Object.keys(bots)[0]];
            }

            console.log({msg: "Fetched bot data", bots});

            Settings.save();
        }).catch((error)=>{
            console.error(error);
        })

        
    }
}

// Match Buttons

function addMatchButtons(){

    const keyEx = /(\d*(?= keys?))/;
    const refEx = /\d*(.\d*)?(?= ref)/;

    // Parse text into a price object
    const parseListingPrice = function(price){
        return {
            keys:  parseFloat(keyEx.exec(price) ? keyEx.exec(price).shift() : 0),
            metal: parseFloat(refEx.exec(price) ? refEx.exec(price).shift() : 0)
        };
    }

    // Do not match these 
    const hasBlacklistedProperties = function(info){
        if( info.data('paint_name')     !== undefined || 
            info.data('spell_1')        !== undefined || 
            info.data('part_price_1')   !== undefined || 
            info.data('killstreaker')   !== undefined ||
            info.data('sheen')          !== undefined ){
            return true;
        }
           
        return false;
    }

    // Spawns the actual button
    const spawnMatchButton = function (){
        let element = $(this);   
        const info = element.find('.item');
        const price = parseListingPrice(info.data('listing_price') || "");
        const match = `<a data-postfix="/item/${encodeURIComponent((info.prop('title') || info.data('original-title')).trim())}?keys=${price.keys}&metal=${price.metal}&intent=${info.data('listing_intent')}" title="Match this user's price" target="_blank" class="btn btn-bottom btn-xs btn-success gladiator-context">
                <i class="fa fa-sw fa-tags"></i>
            </a>`;
        
        if(!hasBlacklistedProperties(info) || info.data('listing_intent') === "sell" )
            element.find(".listing-buttons").prepend(match);
    };


    let sellers =   $($(".media-list")[0]);
    let buyers =    $($(".media-list")[1]);

    sellers .find(".listing").each(spawnMatchButton);
    buyers  .find(".listing").each(spawnMatchButton);

    // what the fuck
    globalThis.unsafeWindow.jQuery('.fa-tags').parent().tooltip(); // VERY gross hack for tooltips
}

// TODO: To be added later, do not remove returns

/*
function effect(){
    return;
    let check;

    appendCheck(".panel-body > .padded");
    $(".panel-body > .padded").append(buttons.addAll);

    buttons.addAll.on("click", ()=>{
        check = buttons.check.find("input").val();
        addItems("#unusual-pricelist > li", check)
    });
}

function unusual(){
    return;
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



async function appendCheck(selector){
    $(selector).append(buttons.check);
    if(new Boolean(await GM.getValue("check", false))){
        buttons.check.click();
    }
    buttons.check.on("click", function(){
        GM.setValue("check", $(this).val());
    })
}
*/

/**
 * Add items in bulk
 * @param {string | Array} input CSS selector of items to add or array of pre-made items to add 
 * @param {boolean} redirect True if extension is to redirect after adding the items 
 */
/*
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
}*/


function backpackUserscript(pathname){
    function settings(){

        const modal = [
            'Settings', 
            Settings.form.render(), 
            $('<a class="btn btn-default" data-dismiss="modal">Save</a>')
        ];
        const $settings = $(`<li class="li-gladiator-options"><a>${svg.options} Bot Settings</a> </li>`);
        $settings.on('click', () =>  Modal.render(...modal).$base
                                    .on('hide.bs.modal', () => {
                                        Settings.form.submit();
                                        reloadManageLink();
                                    }));
                            
        $('[href="/settings"]').parent().after($settings);
    }

    // The add on gladiator button on Stats
    function bpStatsAdd(){
        const $addButton = $(`
            <a class="price-box gladiator-context gladiatortf-add" data-postfix="/item/${encodeURIComponent($('.stats-header-title').text().trim())}/add" target="_blank" data-tip="top" data-original-title="Gladiator.tf">
                <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
                <div class="text">
                    <div class="value" style="font-size: 14px;">Add on Gladiator.tf</div>
                </div>
            </a>
        `);
    
        $('.price-boxes').append($addButton);
    }

    // The add on gladiator button on popups
    function bpPopupAdd(){
        $("body").on("mouseover", ".item", function () {
            let self = this;
            let id = setInterval(function() {
                if ($(self).next().hasClass("popover")) {
                    let popover = $(self).next().find("#popover-price-links");
    
                    if (popover.find(`a[href^='https://${GLAD_DOMAIN}']`).length == 0) {
                        popover.append("<a class=\"btn btn-default btn-xs\" href=\"" + `https://${GLAD_DOMAIN}/manage/${Settings.data.manageContext}/item/${encodeURIComponent($($(self)[0]).data('original-title'))}/add` + "\" target=\"_blank\"><img src=\"https://gladiator.tf/favicon-96x96.png\" style='width: 16px;height: 16px;margin-top: -2px;'> Add on Gladiator.tf</a>");
                    }
    
                    clearInterval(id);
                }
            }, 50);
            setTimeout(function () {
                clearInterval(id);
            }, 750);
        });
    }

    // After settings are changed we gotta update the links
    function reloadManageLink(){
        const manageContext = Settings.data.manageContext || "my";
        
        $('.gladiator-context').each(function(){
            $(this).attr('href', `https://${GLAD_DOMAIN}/manage/${manageContext}${$(this).data('postfix')}`); 
        });
    }


    $('[title="Gladiator.tf Instant Trade"]').css('margin-right','3px');

    for (let i of document.getElementsByClassName('price-box')) {
        if (i.origin === `https://${GLAD_DOMAIN}`) { 
          return;
        }
    }


    const patterns = {
        ".*": [settings],
        "(\/stats)|(\/classifieds)": [bpPopupAdd, bpStatsAdd, addMatchButtons],
        "effect\/":     [bpPopupAdd /*, effect */ ],
        "unusual\/":    [bpPopupAdd /*, unusual */]
    };

    execOnRegexMatch(patterns, pathname);
    reloadManageLink();
    injectCSS(css.bptf);
    
    buttons = {
        addAll: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all</a>`),
        addAllPriced: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all priced unusuals</a>`),
        addAllUnPriced: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all unpriced unusuals</a>`),
        check: $(`<div class="" target="_blank"><input type="checkbox" id="store-check">Store to Add Later</div>`)
    }
}

function gladiatorUserscript(pathname){
    $('body').attr('data-extension-active', true);
};

let buttons = {};
(function() {
    'use strict';
    const entrypoints = {
        "(gladiator\.tf)|(127.0.0.1)": gladiatorUserscript,
        "backpack\.tf|(gladiator\.tf:2053)|(127.0.0.1:2053)": backpackUserscript
    }
    Settings.load().then((data)=>{
        console.log(['Fetched data from storage', data]);
        
        Settings.updateBotData();
        execOnRegexMatch(entrypoints, window.location.origin, [window.location.pathname]);
    });
})();



/** @typedef {Object<string, Function|Function[]>} MatchExec */
/**
 * @param {MatchExec} matchAndExec 
 * @param {string} test 
 * @param {any[]|any[][]} [payload]
 */
 function execOnRegexMatch(matchAndExec, test, payload = []){
    Object.entries(matchAndExec).forEach((entry)=>{
        const [regex, toExecute] = entry;

        const regexObj = new RegExp(regex);

        if(regexObj.test(test)){
            if(typeof toExecute === 'function')
                toExecute(...payload);
            if(Array.isArray(toExecute)){
                for(let i = 0; i < toExecute.length; i++){
                    if(typeof toExecute[i] === 'function'){
                        let localPayload = [];
                        if(Array.isArray(payload[i]))
                            localPayload = payload[i];

                        toExecute[i](...localPayload);
                    }
                }
            }
        }
    })
}

const injectCSS = (css) => $(document).find('head').append(`<style>${css}</style>`);
