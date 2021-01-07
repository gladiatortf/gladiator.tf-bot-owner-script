// ==UserScript==
// @name         Gladiator.tf bot owner script
// @namespace    https://steamcommunity.com/profiles/76561198320810968
// @version      1.3
// @description  A script for owners of bots on gladiator.tf
// @author       manic
// @grant        none
// @license      MIT

// @homepageURL     https://github.com/mninc/gladiator.tf-bot-owner-script
// @supportURL      https://github.com/mninc/gladiator.tf-bot-owner-script/issues
// @downloadURL     https://github.com/mninc/gladiator.tf-bot-owner-script/raw/master/gladiator.user.js

// @run-at       document-end
// @match        https://backpack.tf/stats*
// ==/UserScript==

(function() {
    'use strict';

    $('.price-boxes').append(
        `<a class="price-box" href="https://gladiator.tf/manage/my/item/${encodeURIComponent($('.stats-header-title').text().trim())}/add" target="_blank" data-tip="top" data-original-title="Gladiator.tf">
            <img src="https://gladiator.tf/favicon-96x96.png" alt="gladiator">
            <div class="text" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 0;">
                <div class="value" style="font-size: 14px;">Add on Gladiator.tf</div>
            </div>
        </a>`);
})();
