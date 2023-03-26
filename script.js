// https://www.youtube.com/watch?v=6uM_wLOayYI&t=809s

  /*****************
    1 - create variables, set dimensions. 
    2 - create 3 empty functions:
      - generateScales() will create the actual Scales taking the values from xScale, scaleY.
      - drawCells() will draw the rectangular cells, set their x, y - coordinates, height property etc. 
      - drawAxes() draws the axes onto chart
    3 - import JSON data into our page:
      3.1. open XMLHttpRequest we had created and set the 3 properties for it.
      3.2. set the onload - function that will run once we have response to our request; send the request. log response text.
      3.3. responseText is a JSON-string that needs to be parsed into a javascript-object. Then we store it in the variable "object".
      3.4 - in the data we have properties baseTemperature and monthlyVariance. We are setting baseTemperature to the variable baseTemp. 
      3.5 we are are setting the variable values to an empty array or now.
      3.6 set values to the values-aray.
      3.7 log baseTemp and values.
    4 - Call the (still empty) functions generateScales(), drawCells() and drawAxes() within the onload-method.
    5 - create x-axis:
      5.1  define the xScale using scaleLinear, define the range's min- and max-values.
      5.2 prepare to draw the x-axis and give it the scale xScale
      5.3 to draw we need to create an svg group-element, then call xAxis we just defined above
      5.4 we move xAxis from the top to the bottom of the svg. The distance is (height-padding)
      5.5 give xAxis the id "x-axis".
    6 - create y-axis:
      6.1 we are using d3.scaleTime so we can easily convert numbers 1-12 to month strings ("January", ...) later on.
      6.2 create variable yAxis and give it the scale scaleTime
      6.3 create a group-element in canvas, call yAxis, give the attr. id with the value y-axis, and shift it the value of "padding" to the right 
    7 - draw the rectangles (tag "rect" in svg)
      7.1 - select all rectangles in the canvas
      7.2 call the data() method to bind the rects to the values-array, so every 'rect' is associated with on of the array-elements
      7.3 with enter() we indicate we are about to specify what to do with the rectangles:
        7.3.1 create a new rectangle element for element in the array
        7.3.2 give each 'rect' a class 'cell'.
    8 fill the rects with colors
      8.1 give variance the value of the array-items variance-property
      8.2 create Loop to fill different colors for different ranges of the variance-property-values.
    9 Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and temperature values.
      9.1 create data-year attribute which takes a function  that takes in the array item. return the items year-property. 
      9.2 create data-month attribute which takes a function  that takes in the array item. return the items month-property. To convert the "month"-property (which is 1-12) to javascript- months (0-11), we subtract 1.
      9.3 create data-temp attribute which takes a function  that takes in the array item. return the items temperature-property and add the value of the base-temperature to it.
    10 User Story #9: My heat map should have cells that align with the corresponding month on the y-axis. 
        Refer to https://www.w3schools.com/js/js_dates.asp
      10.1 We fill in the months on the y-axis. For that, we need to set the doomain of scaleY, so it will display the names of the months. Since we are using scaleTime(), the domain will only take Date-objects. Wen need to createm new Date-Objects, which consist of comma separated values from years down to ms. For the y-axis we only need months and wem give the domain the min. and the max.- values 0 and 11 for the month.
      10.2 Since the month December aligns with the x-axis, that leaves no space to draw any rectangle, since the rectangles are drawn frokm the top-left corner down. As a quick fix, adding 1 to the date-objects month value (12 instead of 11) will solve that problem.
      10.3 To set the height for each rect, we divide the height of the y-axis by 12. so that's (height - 2 * padding) / 12.
      10.4 To set the y-value of each rect, wem will be using the scaleY, amnd since that is unsing scaleTime(), we need to give a date to the "y"- attr.
    11 User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.  
      11.1 We create variables to hold the min-and max-Values of the year-property in the values-array
      11.2 We set the domain of xScale to the smallest and the highest year, stored in the variables we just created.
      11.3 Since d3 adds a "," after every 3 digits of a integer, the years on the x-axis don't align yet with the cells. So, we need to format the years to remove the commas. 
      For that purpose, we use the d3.tickFormat() function and we pass in 'd' which means 'decimal' or 'integer', that will display any number as just an integer
    12 We need to correct the length of the x-Axis to also reflect the last year 2015. So we add 1 to maxYear
    13 As of now, January is still not displayed on the y-axis. Lets correct that:
      13.1 As for the xAxis, we are going to use .tickFormat(). Since we are using a scaleTime(), we need to call the timeFormat() -method. As a format-string, we give it '%B', this means show the months as a string.
    14 To draw the legend, we create another svg-element in the 'body' of our document, in the html-part. 
      14.1 We create 4 'rect' elements in the html
      14.2 we give each 'rect am description text
    15 tooltips
      15.1 we create a div-element in our html with the id "tooltip". All the information of the tooltip will show insid this div.
      15.2 We hide the tooltip by default using css. We only want it to show on mouseover.
      15.3 in our script, we select the tooltip and assign it to a variable 'tooltip'. 
      15.4 We call 'on' and we create a mouseover-event for the rectangles
      15.5 to change the tooltips style, we call the transition-method()...
      15.6 ... and we change the 'visibility' to 'visible'
      15.7 We create an array with the month names
      15.8 We add a text with year, month (in letters) the items temperature- value as well as the variance-value
 
  *****************/
  
      let jsonUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  
      let request = new XMLHttpRequest(); // 3.1
    
      let baseTemperature;
      let values = []; // 3.5
    
      let scaleX;
      let scaleY;

      let minYear; // 11.1
      let maxYear;
   
      let padding = 60;
      let width = 1200;
      let height = 600;
    



      let tooltip = d3.select('#tooltip') // 15.3
    
      let generateScales = () => {

          minYear = d3.min(arrayValues, (item) => { // 11.1
              return item['year']
          })

          maxYear = d3.max(arrayValues, (item) => { // 11.1
            return item['year'] + 1 // 12
          })

          scaleX = d3.scaleLinear() // 5.1.
                    .domain([minYear, maxYear]) // 11.2
                    .range([padding, width-padding])
          
          scaleY = d3.scaleTime() // 5.5
                      .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)]) // 10.1, 10.12
                      .range([padding, height-padding])
      }

      let canvas = d3.select('#canvas')
      canvas.attr('width', width)
      canvas.attr('height', height)
    
      let drawCells = () => { // 7

            canvas.selectAll('rect') // 7.1
                    .data(arrayValues) // 7.2
                    .enter() // 7.3
                    .append('rect') // 7.3.1
                    .attr('class', 'cell') // 7.3.2
                    .attr('fill', (item) => { // 8
                        variance = item['variance'] // 8.1
                        if(variance <= -1) { // 8.2
                          return 'SteelBlue'
                        } else if (variance <= 0) {
                          return 'LightSteelBlue'
                        } else if (variance <= 1) {
                          return 'Orange'
                        } else {
                          return 'red'
                        }
                    })
                    .attr('data-year', (item) => { // 9.1
                      return item['year']
                    })
                    .attr('data-month', (item) => { //  9.2
                      return item['month'] - 1
                    })
                    .attr('data-temp', (item) => { // 9.3
                      console.log(`data-temp: ${item['variance'] + baseTemperature}`)
                      return item['variance'] + baseTemperature
                    })
                    .attr('height', (height - 2 * padding) / 12) // 10.3
                    .attr('y', (item) => { // 10.4
                      return scaleY(new Date(0, item['month'] - 1, 0, 0, 0, 0, 0))
                    })
                    .attr('x', (item) => {
                      return scaleX(item['year'])
                    })
                    .attr('width', (width - 2 * padding) / (maxYear - minYear))

                    .on('mouseover', (item) => { // 15.4
                        tooltip.transition() // 15.5
                                .style('visibility', 'visible')  // 15.6

                        let monthNames = [ // 15.7
                          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Ocober', 'November', 'December'
                        ]

                        tooltip.text(item['year'] + ' ' + monthNames[item['month'] -1 ] // 15.8
                            + ' - ' + (baseTemperature + item['variance']).toFixed(3) + ' (' + item['variance'] + ')')
                        
                        tooltip.attr('data-year', item['year'])

                        })



                       /* tooltip.attr('visibility', 'visible')
                        tooltip.attr('data-year', (item) => {
                        return(item['year'])
                      })
                        tooltip.append(text, (item) => {
                        return(item['year'])
                      }) */
                    
                    .on('mouseout', (item) => {
                        tooltip.transition()
                        .style('visibility', 'hidden')
                    })

    
      }
    
      let drawAxes = () => {
    
          let xAxis = d3.axisBottom(scaleX) // 5.2
                        .tickFormat(d3.format('d')) // 11.3
          let yAxis = d3.axisLeft(scaleY) // 6.2
                        .tickFormat(d3.timeFormat('%B')) //  13.1
      
          canvas.append('g') // 5.3
                .call(xAxis)
                .attr('id', 'x-axis') // 5.5
                .attr('transform', `translate(0, ${height-padding})`); // 5.4;
                console.log(xAxis);

          canvas.append('g') // 6.3
                .call(yAxis)
                .attr('id', 'y-axis')
                .attr('transform', `translate(${padding}, 0)`)
      }
    
      
      request.open('GET', jsonUrl, true); // 3.1:
    
      request.onload = () => { // 3.2:
        console.log(request.responseText);
        let object = JSON.parse(request.responseText); // 3.3
        baseTemperature = object['baseTemperature']; // 3.4
        arrayValues = object['monthlyVariance']; // 3.6
        console.log(baseTemperature); // 3.7
        console.log(arrayValues);
        generateScales(); // 4.
        drawCells();
        drawAxes();
      }
      request.send()
    
    
    
    
    
      /*****************
        dataset: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
        
        Structure of the JSON: 
        
      {
      "baseTemperature": 8.66,
      "monthlyVariance": [
        {
          "year": 1753,
          "month": 1,
          "variance": -1.366
        },
        {
          "year": 1753,
          "month": 2,
          "variance": -2.223
        },
      ******************/
