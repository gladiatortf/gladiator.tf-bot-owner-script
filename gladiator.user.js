// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://steamcommunity.com/profiles/76561198320810968
// @version      1.12
// @description  A script for owners of bots on gladiator.tf
// @author       manic, moder112
// @grant        GM.getValue
// @grant        GM.setValue
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
    options: `<svg style="width:36px;height:36px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.23 36.96">
        <path fill="#fbb040" d="M19.67 0 13.3 1.78l2.4 5.33c-.22.1-.4.2-.65.34l-.43.21a16.86 16.86 0 0 0-3.41 2.5l-4-4.33-4.07 4.97 5.02 3.02c-.17.27-.35.55-.49.8a18.22 18.22 0 0 0-1.63 4.54l-.03.2-5.7-1.25-.3 6.6 5.78-.47A16.4 16.4 0 0 0 7 29.18l-5.36 2.3 3.31 5.48 5.74-4.7 3.52-2.8c0-.02-.03-.04-.04-.06l-.2-.27-.39-.54a9.62 9.62 0 0 1-1-1.78v-.02a10.3 10.3 0 0 1-.8-3.05 7.94 7.94 0 0 1 0-1.8l.03-.29c.04-.32.08-.65.14-.96.18-1.07.5-2.1 1.06-3.16.12-.2.25-.37.37-.56.27-.43.56-.83.87-1.2l.05-.06a15.61 15.61 0 0 1 2.24-2.15c.57-.36 1.1-.64 1.64-.9a9.8 9.8 0 0 1 2.1-.74l.74-.14.08-.01c.3-.04.63-.08.97-.1a13.16 13.16 0 0 1 4.02.61l.17.05c.4.12.8.28 1.19.44l.26.1 1.04-1.97 4.48-8.45L27.2.25 26 6a16.75 16.75 0 0 0-5.64-.24L19.67 0z"/>
        <path fill="#fff" d="M19.22 12.87c-.9.36-1.76.82-2.55 1.37a10.4 10.4 0 0 0-3.17 3.57 9.92 9.92 0 0 0-1.17 4.85 9.87 9.87 0 0 0 1.19 4.8 10.28 10.28 0 0 0 3.2 3.57 9.5 9.5 0 0 0 2.47 1.28c.9.31 1.86.47 2.82.47h1a8 8 0 0 0 2.82-.51c.9-.34 1.75-.79 2.55-1.33.5-.36.97-.76 1.4-1.19v-7.7h-5.85l-2.65 3.49H25v2c-.71.36-1.5.55-2.29.55h-.29a6.21 6.21 0 0 1-2.08-.43 4.94 4.94 0 0 1-2.86-2.93 6.35 6.35 0 0 1 0-4.2c.22-.7.6-1.35 1.13-1.87a6.62 6.62 0 0 1 1.87-1.29c.69-.33 1.44-.5 2.2-.51.51 0 1.02.06 1.52.17l-1.38 1.63h4.28l2.73-3.28a9.56 9.56 0 0 0-6.55-3.1 8.35 8.35 0 0 0-4.06.59Z" data-name="Layer 1"/>
    </svg>`
}

/** @typedef {{ bots: Bots, manageContext: string }} SettingsData */

/** @typedef { Object<string, string> } Bots */

const Settings = {
    /** @type {SettingsData} */
    data: {
        manageContext: 'my',
        bots: {}
    },
    /** @returns {Promise<SettingsData>} */
    load: ()=>{
        return new Promise((resolve)=>{
            GM.getValue('settings', JSON.stringify(Settings.data)).then((settings)=>{
                const parsed = JSON.parse(settings);
                Settings.data = parsed;
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
            const $select = $("<select name='manageContext'></select>");
            console.log(Settings.data.bots);
            console.log(Object.entries(Settings.data.bots));
            Object.entries(Settings.data.bots).forEach((bot)=>{
                $select.append(`<option value="${bot[1]}" ${Settings.data.manageContext === bot[1] ? 'selected' : ''}>${bot[0]}</option>`)
            })
        
            const $bots = $(`<div>
            <h4>Choose The Bot</h4>
            <hr>
            </div>`);
            (botAmount > 0 ? $select : $(`<span>You dont have multiple bots, or if you do, <a href="https://${GLAD_DOMAIN + '/manage?kickback=true'}">view your manage page</a> to refresh</span>`)).insertAfter($bots.find("hr"));
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
        /** @returns {Bots|null} */
        function fetchBotData(){
            /**
             * @type {JQuery<HTMLFormElement>}
             */
            const form = $("#userBots");
            if(form.length === 0 || !form.serializeArray)
                return null;
            
            let formData = {};
            form.serializeArray().forEach((entry)=>formData[entry.name] = entry.value);

            return formData;
        }

        let fetched = fetchBotData();

        if(fetched !== null){
            Settings.data.bots = fetched;
            
            console.log({msg: "Fetched data from /manage", bots: Settings.data.bots});

            Settings.save();
        }
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
        const $svg =  
        $(`<a class="price-box" data-tip="top" data-original-title="Gladiator.tf">
                ${svg.options}
                <div class="text" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 0;">
                    <div class="value" style="font-size: 14px;">Settings</div>
                </div>
            </a>`)
        .on('click', () => Modal.render('Settings', Settings.form.render()).$base
                                .on('hide.bs.modal', () => {
                                    Settings.form.submit();
                                    reloadManageLink();
                                }));
    
        $('.price-boxes').append($svg);   
    }

    // The add on gladiator button on Stats
    function bpStatsAdd(){
        const $addButton = $(`
            <a class="price-box gladiator-context" data-postfix="/item/${encodeURIComponent($('.stats-header-title').text().trim())}/add" target="_blank" data-tip="top" data-original-title="Gladiator.tf">
                <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
                <div class="text" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 0;">
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
        const { manageContext } = Settings.data;
        
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

    const classiesAndStats = [bpPopupAdd, bpStatsAdd, addMatchButtons];

    const patterns = {
        "\/stats":      [...classiesAndStats, settings],
        "\/classifieds":[...classiesAndStats],
        "effect\/":     [bpPopupAdd, settings /*, effect */ ],
        "unusual\/":    [bpPopupAdd, settings /*, unusual */]
    };

    execOnRegexMatch(patterns, pathname);
    reloadManageLink();
    
    buttons = {
        addAll: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all</a>`),
        addAllPriced: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all priced unusuals</a>`),
        addAllUnPriced: $(`<a class="btn btn-default" target="_blank"><i class="fas fa-plus-circle"></i>Add all unpriced unusuals</a>`),
        check: $(`<div class="" target="_blank"><input type="checkbox" id="store-check">Store to Add Later</div>`)
    }
}

function gladiatorUserscript(pathname){
    if(pathname === '/manage') Settings.updateBotData();
    $('body').attr('data-extension-active', true);
};

let buttons = {};
(function() {
    'use strict';
    const entrypoints = {
        "(gladiator\.tf)|(127.0.0.1)": gladiatorUserscript,
        "backpack\.tf": backpackUserscript
    }
    Settings.load().then(()=>{
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