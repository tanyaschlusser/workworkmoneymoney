/*
 * Import any necessary libraries. All visualizations already have access to jQuery
 * through $
 */
var d3 = require(‘d3’);
var topojson = require(‘topojson’);
var _ = require(‘lodash’);


/*
 * Initialize a new visualization and call the internal _init function
 */
var MyCustomViz = function(selector, data, images, opts) {
    this.opts = opts || {};
    
    this.width = (opts.width || $(selector).width()) - margin.left - margin.right;
    this.height = (opts.height || (this.width * 0.6)) - margin.top - margin.bottom;
    
    this.data = this._formatData(data);
    this.selector = selector;
    this._init();
};

/*
 * Initialize the visualization. This is kept separate by convention to make it easy
 * to inherit from other visualization types.
 */
MyCustomViz._init = function() {
    // draw the actual visualization here

    us = this.data.us;
  
    var projection = d3.geo.albersUsa()
      .scale(this.width)
      .translate([this.width / 2, this.height / 2]);
  
    var path = d3.geo.path()
      .projection(projection);
  
    var states = clickmap.selectAll("g.state")
       .data(topojson.feature(us, us.objects.states).features
           .filter(function(d) { return d.properties.STATE_FIPS != '72'; })
          )
      .enter().append("g")
       // Exclude Puerto Rico because at this scale it is just 1 point
       // and there will be a rendering error because there is no centroid.
       .attr("class", "state")
       .on("mouseover", function(d) {
           var this_state = d.properties.STATE;
           d3.selectAll("li.state").classed("falsehover", 
             function(dd) { return dd.STATE == this_state ? true : false; });
         })
       .on("mouseout", function(d) {
           d3.selectAll("li.state").classed("falsehover", false);
         });
  
    states.append("path")
       .attr("d", path)
       .attr("id", function(d) { return d.properties.STATE; })
       .on("mousedown",
         function(d){
          d3.select("#" + d.properties.STATE).classed("click", true); 
         })
       .on("mouseup",
         function(d){ 
          d3.select("#" + d.properties.STATE).classed("click", false);
         });
  
    states.append("text")
       .attr("class", "label")
       .attr("x", function(d){ return path.centroid(d)[0]; })
       .attr("y", function(d){ return path.centroid(d)[1]; })
       .attr("dy", "5px")
       .attr("font-family", "Sans-Serif" )
       .text(function(d){ 
        return d.properties.ABBR; })

    /*---------------------------------------------- The lookup list
     *                                    (for the visually impaired)
     */
    var lookups = d3.select("#lookup")
      .append("ul").selectAll("li")
        .data(topojson.feature(us, us.objects.states).features
            .map(function(f){ return f.properties; })
            .filter(function(d) { return d.STATE_FIPS != '72'; })
            .sort(function(a, b){ return a.STATE.localeCompare(b.STATE); }))
      .enter().append("li")
       .attr("class", "state")
       .text(function(d) { return d.ABBR; })
      .on("mouseover", function(d) {
           var this_state = d.STATE;
           d3.selectAll("g.state").classed("falsehover", 
             function(dd) {
              return dd.properties.STATE == this_state ? true : false; });
         })
      .on("mouseout", function(d) {
           d3.selectAll("g.state").classed("falsehover", false);
         });

}

/*
 * Take the provided data and return it in whatever data format is needed
 */
MyCustomViz._formatData = function(data) {
   // …
   // Create a JSON object with keys as the data names
   // and values as the data values.
   // …
  var transformedData = data.reduce(
        function(previousValue, currentValue) {
          previousValue[currentValue.name] = currentValue.data;
          return previousValue;
        }, {});
   
    return transformedData;
    
}

/*
 * Optional function, use this if you want to users to send updated data to this plot
 *
MyCustomViz.updateData = function(data) {
    this.data = this._formatData(data);
    // then update the visualization
}
 */

/*
 * Optional function, use this if you want to enable streaming updates to this plot
 *
MyCustomViz.appendData = function(data) {
    this.data = this.data.concat(this._formatData(data));
    // then update the visualization
}
 */


module.exports = MyCustomViz
