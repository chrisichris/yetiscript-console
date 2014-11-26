YetiScript Console
=================

A Chrome extension for writing [YetiScript](https://github.com/chrisichris/yetiscript) 
within the Web Inspector and run it within the context of the current window.

It uses as a backend a YetiScript compile server.

Installation
------------
   * install [YetiScript](https://github.com/chrisichris/yetiscript) 
   * git clone this repo 
   * visit ``chrome://extensions`` in your browser
   * Ensure *Developer mode* is checked
   * Click *Load unpacked extension...* and navigate to the directory of the
     cloned repo

Run It
------
    
    * start the YetiScript compile server: ``yjs -server``
    * open the javascript console in chrome and open the ``JavaScriptConsole`` tab.

Features
--------

   * Editor provided via the ACE editor http://ace.ajax.org/
   * YetiScript rest api compilation https://github.com/chrisichris/yetiscript
   * Command+Enter or Shift+Enter to run the current script

Credits
-------

Based on [CoffeeConsole](https://github.com/snookca/CoffeeConsole) 
by Jonathan Snook

Copyright 2014, Christian Essl
Released under the MIT License
