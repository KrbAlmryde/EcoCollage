function InitMosquitos(Num){
    Num = Num || 40;
    var canvas = document.createElement("canvas"),
    c =canvas.getContext("2d"),
    particles = {},
    particleIndex =0,
    particleNum = Num;//put (Num) here

    // draw black background rectangle
    canvas.width =400;
    canvas.height= 400;
    document.body.appendChild(canvas);
    c.fillStyle ="white";
    c.fillRect(0,0,canvas.width,canvas.height);
    //-----------
    // Mosquitos function
    function Particle(){
        this.x = canvas.width/(Math.random() *10 -5);
        this.y = canvas.height/(Math.random() *10 -5);
        this.vx = Math.random() *10 -5;
        this.vy = Math.random() *10 -5;
        particleIndex++;
        particles[particleIndex] =this;
        this.id = particleIndex;
        this.life =0;
        this.maxLife = Math.random() *30+40;

    }

    Particle.prototype.draw = function(){
        this.x +=this.vx;
        this.y +=this.vy;
        this.life++;

        if (Math.random() <0.1){
            this.vx = Math.random() *10-5;
            this.vy = Math.random() *10-5;
        }

        if (this.life >= this.maxLife) {
            delete particles[this.id];
        }

        c.fillStyle="rgba(25,25,25,0.5)";
        c.fillRect(this.x,this.y,10,10);
    }

    setInterval(function(){
        c.fillStyle ="rgba(255,255,255,0.2)";
        c.fillRect(0,0,canvas.width,canvas.height);

        for(var i=0 ; i <= particleNum; i++) {
            new Particle();
        }

        for (var i in particles){
            particles[i].draw();
        }

    }, 30);

};