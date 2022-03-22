// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://steamcommunity.com/profiles/76561198320810968
// @version      1.17
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
        .glad-fieldset {
            padding: revert!important;
            margin: revert!important;
            border: 1px solid silver!important;
            display: flex;
            align-items: center;
            width: fit-content;
        }
        .glad-fieldset > legend{
            width: revert!important;
            border-bottom: 0!important;
            margin-bottom: revert!important;
            font-size: 1.5rem;
        }
        .glad-fieldset span {
            color: #B45309;
        }
        .glad-fieldset legend{
            font-weight: 500;
        }

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

        .glad-reload {
            pointer-events: none;
        }
        .glad-reload button{
            pointer-events:all;
        }

        @media (max-width: 958.999px){
            path {
                fill: #888!important;
            }
        }
    `
}

let fieldset = `<fieldset class="glad-fieldset"><legend>Add to <span class="gladiator-bot-name">GladiatorTF Bot</span></legend></fieldset>`;

/** @typedef {{ bots: Bots, lastCache: Date, manageContext: string, isKillstreakChecked: Boolean }} SettingsData */

/** @typedef { Object<string, string> } Bots */

const Settings = {
    /** @type {SettingsData} */
    data: {
        manageContext: 'my',
        lastCache: new Date().setDate(new Date().getDate() - 1),
        bots: {},
        isKillstreakChecked: false
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
            const $reload = $(`<div class="form-group glad-reload"><button class="btn btn-variety ">Reload Bots</button></div>`);
            $reload.on('click', (e)=>{
                
                Settings.data.lastCache = 0;
                Settings.updateBotData().then(()=>{
                    $parent.remove();
                    $('#active-modal .modal-body').append(Settings.form.render());
                    
                })
                e.preventDefault();
            });


            (botAmount > 0 ? $select : $(`<span>You dont have any bots</span>`)).insertAfter($bots.find("label"));
            $parent.append($bots);
            $bots.after($reload);
        
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
        return new Promise((resolve)=>{
            
            if(new Date(Settings.data.lastCache).getDate() === new Date().getDate()) {
                console.log('less than a day passed');
                resolve();
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
            }).finally(resolve);
        });
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
    document.defaultView.jQuery('.fa-tags').parent().tooltip(); // VERY gross hack for tooltips
}


function backpackUserscript(pathname){

    function killstreakCheck(){

        const check = $(`<label class="checkbox-inline" style="margin-left: 10px;"><input type="checkbox" id="add-ks" ${Settings.data.isKillstreakChecked ? 'checked' : ''}>Add Killstreaks</label>`);
       
        check.find('input').on('click', function(){
            Settings.data.isKillstreakChecked = $(this).is(':checked');
            Settings.save();
        })

        return check;
    }

    function bulkAdd(itemNames){
        //https://gladiator.tf/api/bots/%20/add
        
        const error = (msg)=>{
            const modal = [
                'Error',
                msg
            ]
            Modal.render(...modal);
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: `https://${GLAD_DOMAIN}/api/bots/${Settings.data.manageContext || "my"}/items/add`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({items: itemNames}),
            onload: function (data) {
                try{
                    let response = JSON.parse(data.responseText);
                    console.log(response);
                    if (!response.success) throw response.error || "Unknown  Error";

                    const results = Object.entries(response.results);
                    if(!results.length) throw 'No items added, are you logged into gladiator?';

                    let failedAdds = [];

                    results.forEach(result =>{
                        const [item, success] = result;

                        if(!success) failedAdds.push(item);
                    });

                    const botName = Object.entries(Settings.data.bots).filter(([name, id]) => id === Settings.data.manageContext)[0][0];

                    let msg =   failedAdds.length === 0                     ? 
                                `${results.length} items successfully added to ${botName}`: 
                                `Some items failed to be added (${results.length - failedAdds.length}/${results.length} Successful):<br> ${failedAdds.join('<br>')}`;
                    
                    Modal.render('Adding Items', msg);

                }catch(ex){
                    error(`Error while making request to gladiator: ${ex}`);
                    console.error(data);
                    console.error(ex);
                }
            },
            onerror: error
        });
    };

    function appendAddButtons(buttons, location){
        
        const $buttonGroup = $(`<fieldset class="glad-fieldset"><legend>Add to <span class="gladiator-bot-name">GladiatorTF Bot</span></legend><div class="btn-group btn-group-sm"> </div></fieldset>`);

        buttons.forEach(button=>{
            const [name, selector] = button;

            const hat = $(selector).find('h1').text();
            const parse = (text) => `${text.replaceAll('\n', '').trim()} ${hat.replaceAll('\n', '').trim()}`;

            const $button = $(`<a class="btn btn-variety q-440-text-1">${name}</a>`);
            $button.on('click', ()=>{

                let toAdd = [];

                if(!$(selector).is('table')){
                    $(selector).find('li').each(function(){
                        toAdd.push($(this).prop("title") || $(this).data("original-title"));
                    });
                }else{
                    $(selector).find('tbody th').each(function(){
                        toAdd.push(parse($(this).text()))
                    })
                }
                
                bulkAdd(toAdd);
            });

            $buttonGroup.find('div').append($button);
        })

        const $container = $(`<div style="width:100%;"></div>`).append($buttonGroup);

        $(location).after($container);


        
    }

    function effect(){
        appendAddButtons([
            ['Add All Priced', '#unusual-pricelist']
        ], '.input-group:first');
    }

    function unusual(){
        appendAddButtons([
            ['Add All', '.unusual-pricelist, .unusual-pricelist-missing'],
            ['Add All Priced', '.unusual-pricelist'], 
            ['Add All Unpriced', '.unusual-pricelist-missing']
        ], '.input-group:first');
    }



    function pricelist(){
        const last = $('#pricelist-pagination-container a:contains("Last")').attr('href');  
        const totalPages = parseInt(last.split("(")[1].split(")")[0]);

        const waitOnPageToLoad = (page)=>{
            return new Promise((resolve)=>{
                const check = ()=>{
                    const $el = $('#pricelistContainer > li:first > li span.label');    
                    return $el.attr('data-original-title') || $el.attr('title');
                };

                let beforeReloadStyle = page === 1 ? null : check();
                document.defaultView.setCurrentPage(page);

                let reloadCheck = setInterval(()=>{ 
                    if(beforeReloadStyle !== check()){
                        clearInterval(reloadCheck);
                        resolve();
                    }
                }, 1000);
            });
        }

        const loadAll = (addKS) => {
            return new Promise(async (resolve)=>{
                if($('#pricelist').is('table')){
                    // Spreadsheet view script
                    // not gonna do this rn its a mess

                } else {
                    // Grid view script
                    let items = [];
                    let iterator = 1;
                    while(iterator <= totalPages){
                        await waitOnPageToLoad(iterator);
                        $('#pricelistContainer').find(".item")
                                                .each(function(){
                                                    const price = $(this);
                                                    let name = [price.find('.name').text()]; 
                                                    
                                                    if(addKS && isWeapon(name)) {
                                                        name.push(...generateKillstreaks(name[0]));
                                                    }

                                                    items.push(...name);
                                                });
                        iterator++;
                    }
                    resolve(items);
                }
            });
        }

        const $add = $(`<a class="btn btn-variety q-440-text-1">Add All</a>`);
        const $check = killstreakCheck();
        const $addBlock = $('<a class="btn btn-variety q-440-text-1 disabled">Waiting...</a>').hide();
        $add.on('click', () => {
            $($add, $check, $addBlock).toggle();
            loadAll($('#add-ks').is(':checked')).then((items)=>{
                bulkAdd(items);
                $($add, $check, $addBlock).toggle();
            });
        });

        
        const $fieldset = $(fieldset);
        const $container = $(`<div style="width:100%;"></div>`).append($fieldset);

        $('#pricelist-filters').after($container);

        $fieldset.find('legend').after([$add, $check, $addBlock])
    }


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

        const itemName = $('.stats-header-title').text().trim();

        const $addButton = $(`
            <a class="price-box gladiator-context gladiatortf-add" data-postfix="/item/${encodeURIComponent(itemName)}/add" target="_blank" data-tip="top" data-original-title="Gladiator.tf">
                <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
                <div class="text">
                    <div class="value" style="font-size: 14px;">Add on Gladiator.tf</div>
                </div>
            </a>
        `);
        
        const $fieldset = $(fieldset);
        const $container = $(`<div style="width:100%;"></div>`).append($fieldset);
        $container.append($fieldset);        
        

        const extractedName = [.../(?<=stats\/.*\/).*(?=\/Tradable)/.exec(decodeURI(location.href))][0];

        let variants = [];

        $('.stats-quality-list a:not(#btn-expand-list):not(.untradable)').each(function(){
            variants.push(`${$(this).text().trim()} ${extractedName}`);
        });

        const $addAllButton = $(`
            <a class="price-box gladiatortf-add" data-original-title="Gladiator.tf">
                <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
                <div class="text">
                    <div class="value" style="font-size: 14px;">Add All Variants</div>
                </div>
            </a>
        `).on('click', function(){
            
            const variantsPayload = variants;

            if($('#add-ks').is(':checked')){
                variants.forEach(variant=>{
                    variantsPayload.push(...generateKillstreaks(variant));
                });
            }
            
            bulkAdd(variantsPayload);
        });

        $fieldset.append($addAllButton);

        if(isWeapon(itemName)){

            const $check = killstreakCheck();
            $addButton.on('click', () => {
                if($check.is(':checked')) {
                    const items = [...generateKillstreaks(itemName)];
                    if(items.length > 0)
                        bulkAdd(items);
                }
            });
            $fieldset.append($check);
        }


        
        $('.price-boxes').append($container);
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
        
        const botName = Settings.data.manageContext !== "my" ? Object.entries(Settings.data.bots).filter(([name, id]) => id === Settings.data.manageContext)[0][0] : 'GladiatorTF Bot';

        $('.gladiator-context').each(function(){
            $(this).attr('href', `https://${GLAD_DOMAIN}/manage/${manageContext}${$(this).data('postfix')}`); 
        });

        $('.gladiator-bot-name').text(botName);
    }


    $('[title="Gladiator.tf Instant Trade"]').css('margin-right','3px');

    for (let i of document.getElementsByClassName('price-box')) {
        if (i.origin === `https://${GLAD_DOMAIN}`) { 
          return;
        }
    }

    
    injectCSS(css.bptf);

    const patterns = {
        ".*":                           [settings, bpPopupAdd],
        "(\/stats)|(\/classifieds)":    [addMatchButtons],
        "\/stats":                      [bpStatsAdd],
        "effect\/":                     [effect],
        "unusual\/":                    [unusual],
        "pricelist":                    [pricelist] 
    };
    try {
        execOnRegexMatch(patterns, pathname);
    }catch(ex){
        console.error(ex);
    }
    reloadManageLink();
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


function generateKillstreaks(baseName){
    baseName = new String(baseName) .replace('Professional Killstreak ', '')
                                    .replace('Specialized Killstreak ', '')
                                    .replace('Killstreak ', '');
    

    let nonItemRegex = new RegExp(/(Non-Craftable)|(Unusual)|(Strange)|(Normal)|(Unique)|(Genuine)|(Vintage)|(Collector's) (Australium )?/g);
    let ks = [];
    let itemName = baseName.replace(nonItemRegex, '').trim();
    let nonItemName = baseName.replace(itemName, '');
    itemName = itemName.replace('The ', '');
    ks.push(`${nonItemName}Professional Killstreak ${itemName}`);
    ks.push(`${nonItemName}Specialized Killstreak ${itemName}`);
    ks.push(`${nonItemName}Killstreak ${itemName}`);
    return ks;
}

const weapons = ["Frying Pan", "Black Rose", "Conscientious Objector", "Shortstop", "Big Kill", "Sniper Rifle", "Flame Thrower", "Shotgun", "Bat Outta Hell", "Rocket Launcher", "Lugermorph", "Spy-cicle", "Grenade Launcher", "Minigun", "Air Strike", "Scattergun", "Batsaber", "Bushwacka", "Market Gardener", "Stickybomb Launcher", "Sticky Jumper", "Medi Gun", "Pistol", "Half-Zatoichi", "Widowmaker", "Vaccinator", "Original", "Bat", "Classic", "Gunslinger", "Cow Mangler 5000", "Pretty Boy's Pocket Pistol", "Crusader's Crossbow", "Diamondback", "Gloves of Running Urgently", "Fists", "Righteous Bison", "Tomislav", "Homewrecker", "Force-A-Nature", "Phlogistinator", "Eyelander", "Beggar's Bazooka", "Eviction Notice", "Black Box", "Boston Basher", "Quick-Fix", "Solemn Vow", "Eureka Effect", "Kritzkrieg", "Fists of Steel", "Huntsman", "SMG", "Shovel", "Knife", "Loose Cannon", "Scottish Handshake", "Fortified Compound", "Powerjack", "Conniver's Kunai", "Neon Annihilator", "Rescue Ranger", "Flare Gun", "Wrap Assassin", "Vita-Saw", "Brass Beast", "Escape Plan", "Degreaser", "Sharpened Volcano Fragment", "Pomson 6000", "Wrench", "Manmelter", "Baby Face's Blaster", "Bazaar Bargain", "Huo-Long Heater", "Back Scatter", "Machina", "Cleaner's Carbine", "C.A.P.P.E.R", "Fan O'War", "Shooting Star", "L'Etranger", "Postal Pummeler", "Short Circuit", "Ullapool Caber", "Winger", "Ambassador", "Enforcer", "Natascha", "Overdose", "Sandman", "Scorch Shot", "Sun-on-a-Stick", "Loch-n-Load", "Flying Guillotine", "Backburner", "Equalizer", "Claidheamh Mòr", "Back Scratcher", "Bottle", "Persian Persuader", "Syringe Gun", "Third Degree", "Killing Gloves of Boxing", "Amputator", "AWPer Hand", "Frontier Justice", "Pain Train", "Ubersaw", "Disciplinary Action", "Holiday Punch", "Scottish Resistance", "Axtinguisher", "Jag", "Hitman's Heatmaker", "Nessie's Nine Iron", "Detonator", "Sydney Sleeper", "Tribalman's Shiv", "Soda Popper", "Direct Hit", "Mantreads", "Maul", "Rainblower", "Holy Mackerel", "Reserve Shooter", "Warrior's Spirit", "Candy Cane", "Blutsauger", "Southern Hospitality", "Shahanshah", "Lollichop", "Bread Bite", "Family Business", "Big Earner", "Liberty Launcher", "Scotsman's Skullcutter", "Sharp Dresser", "Revolver", "Your Eternal Reward", "Three-Rune Blade", "Chargin' Targe", "Nostromo Napalmer", "Iron Bomber", "Bonesaw", "Apoco-Fists", "Panic Attack", "Freedom Staff", "Prinny Machete", "Ham Shank", "Kukri", "Quickiebomb Launcher", "Fire Axe", "Unarmed Combat", "Wanga Prick", "Dragon's Fury", "Hot Hand", "Festive", "Botkiller"];    

function isWeapon(name){
    name = new String(name);
    
    if(name.includes('Kit') || name.includes('Fabricator')) return false;
    return weapons.some((weapon)=>{
        return name.includes(weapon);
    });
}

const injectCSS = (css) => $(document).find('head').append(`<style>${css}</style>`);
