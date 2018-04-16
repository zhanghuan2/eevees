
initializeByDom = (dom) ->
  $el = $(dom)
  path_base = $el.data("comp-path") + "/view"
  Component = class extends require(path_base)
    constructor: ->
      @$el = $el
      super (selector) -> $el.find(selector)
  $el.data "compInstance", new Component()

initialize = ($root) ->
  $comps = if $root then $root.find(".js-comp") else $(".js-comp")
  $comps.each ->
    try
      initializeByDom $(@)
    catch e
      console.log(e)

module.exports =
  initialize: initialize
  initializeByDom: initializeByDom
