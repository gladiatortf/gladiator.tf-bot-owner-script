// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://steamcommunity.com/profiles/76561198320810968
// @version      1.9
// @description  A script for owners of bots on gladiator.tf
// @author       manic
// @grant        none
// @license      MIT

// @homepageURL     https://github.com/mninc/gladiator.tf-bot-owner-script
// @supportURL      https://github.com/mninc/gladiator.tf-bot-owner-script/issues
// @downloadURL     https://github.com/mninc/gladiator.tf-bot-owner-script/raw/master/gladiator.user.js

// @run-at       document-end
// @include      /^https?:\/\/(.*\.)?((backpack)|(gladiator))\.tf(:\d+)?\//
// ==/UserScript==

const keyEx = /(\d*(?= keys?))/;
const refEx = /\d*(.\d*)?(?= ref)/;


function parseListingPrice(price){
    return {
        keys:  parseFloat(keyEx.exec(price) ? keyEx.exec(price).shift() : 0),
        metal: parseFloat(refEx.exec(price) ? refEx.exec(price).shift() : 0)
    };
}

function spawnButton(element){
    element = $(element);
    const info = element.find('.item');
    const price = parseListingPrice(info.data('listing_price') || "");
    const match = `<a  href="https://gladiator.tf/manage/my/item/${encodeURIComponent((info.prop('title') || info.data('original-title')).trim())}?keys=${price.keys}&metal=${price.metal}&intent=${info.data('listing_intent')}" title="Match this user's price" target="_blank" class="btn btn-bottom btn-xs btn-success">
            <i class="fa fa-sw fa-tags"></i>
        </a>`;
    

    element.find(".listing-buttons").prepend(match);
}

(function() {
    'use strict';
    
    $(document).ready(function(){
        $('[title="Gladiator.tf Instant Trade"]').css('margin-right','3px');

        //javascript nonsense
        window.jQuery('.fa-tags').parent().tooltip();
    }); 

    for (let i of document.getElementsByClassName('price-box')) {
      if (i.origin === 'https://gladiator.tf') { 
        return;
      }
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

    if(window.location.href.includes('/stats') || window.location.href.includes('/classifieds')) {
        let sellers = $($(".media-list")[0]);
        let buyers = $($(".media-list")[1]);
        sellers.find(".listing").each(function(){spawnButton(this)});
        buyers.find(".listing").each(function(){spawnButton(this)});
          
    }
})();
