// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://steamcommunity.com/profiles/76561198320810968
// @version      1.7
// @description  A script for owners of bots on gladiator.tf
// @author       manic
// @grant        none
// @license      MIT

// @homepageURL     https://github.com/mninc/gladiator.tf-bot-owner-script
// @supportURL      https://github.com/mninc/gladiator.tf-bot-owner-script/issues
// @downloadURL     https://github.com/mninc/gladiator.tf-bot-owner-script/raw/master/gladiator.user.js

// @run-at       document-end
// @include      /^https?:\/\/(.*\.)?backpack\.tf(:\d+)?\/stats\//
// ==/UserScript==

(function() {
    'use strict';

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
})();
