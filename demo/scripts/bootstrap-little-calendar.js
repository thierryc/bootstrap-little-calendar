/* ==========================================================
 * bootstrap-little-calendar.js v0.1.0
 * 
 * ==========================================================
 * Copyright 2012 Autre planete, SAS.
 *
 * Licensed under the MIT license
 * Inspired by bootstrap-calendar plugin and bootstrap-datepicker
 * http://www.eyecon.ro/bootstrap-datepicker/
 * ========================================================== */
 
(function ($) {

  'use strict';

 /* CALENDAR CLASS DEFINITION
  * ========================= */

  var Calendar = function (element, options) {
    this.$element = $(element);
    this.options = options;
    
    var template = '' +
      '<div class="date-header">' +
        '<div class="month"></div>' +
        '<div class="year"></div>' +
      '</div>' +
      '<table class="calendar">' +
        '<thead class="calendar-header"></thead>' +
        '<tbody class="calendar-body"></tbody>' +
        '<tfoot>' +
          '<th colspan="2" data-calendar-action="prev"><div class="arrow"><i class="icon-arrow-left"></i></div></th>' +
          '<th colspan="3" data-calendar-action="current">%todayString%</th>' +
          '<th colspan="2" data-calendar-action="next"><div class="arrow"><i class="icon-arrow-right"></i></div></th>' +
        '</tfoot>' +
      '</table>' +
    '';
    
    this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.weekStart = this.options.weekStart || 1;
    this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
    this.days = this.options.days;
    this.months = this.options.months;
    this.todayString = this.options.todayString;
    this.events = this.options.events;
    this.calendar = $(template.replace('%todayString%', this.todayString))
      .appendTo(this.$element)
      .on({
        click: $.proxy(this.click, this)
      });
    
    this.date = this.options.date || new Date();
    this.init(this.date);
  };

  Calendar.prototype = {
  
    init: function (date) {
      var that = this;
      // Render Days of Week
      this.__renderDays();
      // Render Calendar
      this.__renderCalendar(date);
      
      this.$element.on('setEvents.calendar', function (target, events) {
        that.setEvents(events);
      });
      
      this.$element.on('next.calendar', this.next);
      this.$element.on('current.calendar', this.current);
      this.$element.on('prev.calendar', this.prev);
      
      setTimeout(function(){
        that.$element.trigger('onInit', that)
      },0);
      
    },
    
    __renderCalendar: function (date) {
      
      this.year = date.getFullYear();
      this.month = date.getMonth();
      
      var year = this.year,
          month = this.month,
          now = new Date();
        
      var current = new Date(year, month - 1, 28, 0, 0, 0, 0);
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      
      if (this.__isLeapYear(year)) {
        this.daysInMonth[1] = 29;
      } else {
        this.daysInMonth[1] = 28;
      }
      
      var lastDayOfMonth = this.daysInMonth[current.getMonth()];

      current.setDate(lastDayOfMonth); // set to get the day possition of the last day of the month
      current.setDate(lastDayOfMonth - (current.getDay() - this.weekStart + 7) % 7);
      
      var currentDay = current.getDay(),
          currentDate = current.getDate(),
          currentYear = current.getFullYear(),
          currentMonth = current.getMonth();
          
      var nextMonth = new Date(current);
      nextMonth.setDate(current.getDate() + 42);
      var html = [];
      var dayClass = '';
      var dateString = '';
      
      this.$element.find('.year').empty().append(year);
      this.$element.find('.month').empty().append(this.months[month]);
      
      while (current.valueOf() < nextMonth.valueOf()) {
        
        currentDay = current.getDay();
        currentDate = current.getDate();
        currentYear = current.getFullYear();
        currentMonth = current.getMonth();
        dayClass = '';
        
        if (current.getDay() === this.weekStart) {
          html.push('<tr>');
        }
        
        if ((currentMonth < month &&  currentYear === year) ||  currentYear < year) {
          dayClass += ' old';
        } else if ((currentMonth > month && currentYear === year) || currentYear > year) {
          dayClass += ' new';
        } else {
          dayClass += ' day';
        }
        if (currentDay % 7 === 0 || currentDay % 7 === 6) {
          dayClass += ' weekend';
        }
        
        if (current.valueOf() === today.valueOf()) {
          dayClass += ' today';
        }
        
        dateString =  currentYear + '-' + ('0'+(currentMonth + 1)).slice(-2) + '-' + ('0' + currentDate).slice(-2);
        html.push('<td class="apbscalendar_' + dateString + dayClass + '" data-year="' + currentYear + '" data-month="' + (currentMonth + 1) + '" data-day="' + currentDate + '"><span>' + currentDate + '</span></td>');
        if (current.getDay() === this.weekEnd) {
          html.push('</tr>');
        }
        current.setDate(current.getDate() + 1);
      }
      this.$element.find('.calendar-body').empty().append(html.join(''));
      
      this.loadEvents();

    },
    
    __renderDays: function () {
      var html = '';
      for (var j = this.weekStart; j < this.weekStart + 7; j++) {
        html += '<th>' + this.days[j % 7] + '</th>';
      }
      html = '<tr>' + html + '</tr>';
      this.$element.find('.calendar-header').empty().append(html);
    },
    
    __renderEvents: function (events) {
      var that = this;
      $.each(events.events, function () {
        var eventDate = new Date(this.date);
        if (isNaN(eventDate)) { // IE8 bug fix
          eventDate = that.__dateFromISO(this.date);
        }
        var year = eventDate.getFullYear();
        var month = eventDate.getMonth();
        var day = eventDate.getDate();
        //('0' + eventDate.getDate()).substr(-2,2);
        if (year === that.year && month === that.month) {
          var $day = that.$element.find( 'td.apbscalendar_' + year + '-' + ('0'+(month + 1)).slice(-2) + '-' + ('0' + parseInt(day)).slice(-2) );
          $day.addClass('event');
          var events = $day.data('calendar.events');
          if (!events) {
            events = [];
          }
          events.push(this);
          $day.data('calendar.events', events);
        }
      });
    },
    
    __dateFromISO: function (s) {
      s = s.split(/\D/);
      return new Date(Date.UTC(s[0], --s[1]||'', s[2]||'', s[3]||'', s[4]||'', s[5]||'', s[6]||''))
    },
    
    __isLeapYear: function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    
    getActiveMonth: function () {
      this.$active = this.$element.find('.item.active');
      this.$items = this.$active.parent().children();
      return this.$items.index(this.$active);
    },
    
    click: function (event) {
      event.stopPropagation();
      event.preventDefault();
      var target = $(event.target).closest('td, th');
      if (target.length === 1) {
        switch (target[0].nodeName.toLowerCase()) {
        case 'th':
          switch ($(target[0]).data('calendarAction')) {
          case 'prev':
            this.prev($(target[0]));
            break;
          case 'current':
            this.current($(target[0]));
            break;
          case 'next':
            this.next($(target[0]));
            break;
          }
          break;
        case 'td':
            this.getEvent($(target[0]));
          break;
        }
      }
    },
    
    prev: function (target) {
      var ev = $(target).data();
      ev.type =  'onPrev';
      this.__renderCalendar(new Date(this.year, this.month - 1, 1));
      //console.log(ev);
      this.$element.trigger(ev, this);
    },
    
    current: function (target) {
      var ev = $(target).data();
      ev.type =  'onCurrent';
      this.__renderCalendar(new Date());
      this.$element.trigger(ev, this);
    },

    next: function (target) {
      var ev = $(target).data();
      ev.type =  'onNext';
      this.__renderCalendar(new Date(this.year, this.month + 1, 1));
      //console.log(this.$element);
      this.$element.trigger(ev, this);
    },
    
    setEvents: function (json) {
      this.__renderEvents(json);
    },
    
    getEvent: function (target) {
      var ev = $(target).data();
      //console.log(ev);
      ev.type =  'onClickEvent';
      ev.calendar = this;
      ev.dayTarget = target;
      this.$element.trigger(ev);
    },

    loadEvents: function () {
      if (this.events !== null) {
        if (typeof this.events === 'function') {
          this.__renderEvents(this.events.apply(this, []));
        }
        if (typeof this.events === 'object') {
          this.__renderEvents(this);
        }
      }
    }
    
  };


 /* CALENDAR PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.calendar;

  $.fn.calendar = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('calendar'),
          options = $.extend({}, $.fn.calendar.defaults, typeof option === 'object' && option);
      if (!data) {
        $this.data('calendar', (data = new Calendar(this, options)));
      }
    });
  };

  $.fn.calendar.defaults = {
    weekStart: 1,
    days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    todayString: 'Today',
    events: null
  };

  $.fn.calendar.Constructor = Calendar;


 /* CALENDAR NO CONFLICT
  * ==================== */

  $.fn.calendar.noConflict = function () {
    $.fn.calendar = old;
    return this;
  };

 /* CALENDAR DATA-API
  * ================= */
  
  $(document).on('click.calendar.data-api', '[data-calendar-next], [data-calendar-back]', function (e) {
    var $this = $(this),
        href,
        $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')), //strip for ie7
        options = $.extend({}, $target.data(), $this.data());

    $target.calendar(options);
    e.preventDefault();
  });

}(window.jQuery));


