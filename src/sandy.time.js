/**
 * Sandy.time
 * package 提供time相关方法
 */
 
Sandy.register('.time', function (Sandy) {

    this.time = 0;
    this.startTime = 0;
    this.lastTime = 0;
    this.deltaTime = 0;

    this.tick = function() {
        var tn = new Date().getTime();
        
        if (this.startTime == 0) this.startTime = tn;
        if (this.lastTime != 0) this.deltaTime = tn - this.lastTime;
        
        this.lastTime = tn;
        this.time = (tn - this.startTime) / 1000.0;
    };

    this.formatTime = function() {
        var mil = Math.floor((this.time % 1) * 100);
        var sec = Math.floor(this.time) % 60;
        var min = Math.floor(this.time / 60);
        
        if(mil < 10) mil = "0" + mil;
        if(mil == 100) mil = "00";
        
        if(sec < 10) sec = "0" + sec;
        if(min < 10) min = "0" + min;

        return min + ":" + sec + ":" + mil;
    }

});