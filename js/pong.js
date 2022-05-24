const WIDTH = 1380;
const HEIGHT = 900;
var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
function preload ()
{
    this.load.image('ball', 'assets/ball.png');
    this.load.image('bar', 'assets/bar.png');
    this.load.image('center', 'assets/bar.png');
    this.load.image('side', 'assets/side_bar.png');
}

function create ()
{   
    this.physics.world.setBounds(0, 0 + (HEIGHT * 0.019)  , WIDTH , HEIGHT - ((HEIGHT * 0.019) * 2), true, true, true, true);
    this.playerOneScore = this.add.text(WIDTH  * 0.25, HEIGHT * 0.05, '0', { fontSize: '32px', fill: '#FFFFFF' });
    this.playerTwoScore = this.add.text(WIDTH  * 0.75, HEIGHT * 0.05, '0', { fontSize: '32px', fill: '#FFFFFF' });
    
    this.bot = this.physics.add.image(WIDTH / 2, HEIGHT, 'side').setScale(WIDTH / 900, HEIGHT / 110 / 25).setImmovable();
    this.top = this.physics.add.image(WIDTH / 2, 0, 'side').setScale(WIDTH / 900, HEIGHT / 110 / 25).setImmovable();
    this.center = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'center').setScale(WIDTH / 110 / 80, HEIGHT / 900).setImmovable();

    this.rightBar = this.physics.add.image(WIDTH * 0.97, HEIGHT / 2, 'bar').setOrigin(1, 1).setScale(0.20)
    .setImmovable().setCollideWorldBounds(true);
    this.ball = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'ball').setOrigin(1, 1).setVelocity(WIDTH * 0.5, 0)
    .setBounce(1).setScale(0.03).setCollideWorldBounds(true);
    this.ball.body.setMaxVelocityX(3000);
    this.ball.body.setMaxVelocityY(3000);
    this.physics.add.collider(this.ball, this.rightBar, hitball, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.shake_flag = 0;
    this.up_flag = 0;
    this.down_flag = 0;
}

function hitball (ball, bar)
{
    if (this.shake_flag == 0)
    {
        this.shake_flag = 10;
        this.rightBar.setX(this.rightBar.x + this.shake_flag)
    }
    if ( bar.body.velocity.y != 0)
        ball.body.setVelocityY(bar.body.velocity.y);
    ball.body.setVelocityX(ball.body.velocity.x * 1.1)
}

function update ()
{
    if (this.ball.body.onFloor() && this.down_flag == 0 && this.shake_flag == 0)
    {   
        this.down_flag = 10;
        this.bot.setY(this.bot.y + this.down_flag)
    }
    else if (this.ball.body.onCeiling() && this.up_flag == 0 && this.shake_flag == 0)
    {
        this.up_flag = 10;
        this.top.setY(this.top.y - this.up_flag)
    }
    if (this.shake_flag > 0)
    {
        this.rightBar.setX(this.rightBar.x - 1); 
        this.shake_flag--;
    }
    if (this.up_flag > 0)
    {
        this.top.setY(this.top.y + 1); 
        this.up_flag--;
    }
    if (this.down_flag > 0)
    {
        this.bot.setY(this.bot.y - 1); 
        this.down_flag--;
    }
    if (this.cursors.up.isDown )
    {
        if (this.rightBar.body.velocity.y >= 0)
            this.rightBar.body.setVelocityY(-800);
        else
            this.rightBar.body.setVelocityY(this.rightBar.body.velocity.y * 1.04);
            // this.physics.pause();
    }
    else if (this.cursors.down.isDown)
    {
        if (this.rightBar.body.velocity.y <= 0)
            this.rightBar.body.setVelocityY(800);
        else
            this.rightBar.body.setVelocityY(this.rightBar.body.velocity.y * 1.04);
            // this.physics.resume();
    }
    else
    {
        this.rightBar.body.setVelocityY(0);
    }
    // if (this.ball.body.x > WIDTH)
    // {
    //     this.playerOneScore.setText(parseInt(this.playerOneScore.text) + 1);
    //     this.ball.body.x = WIDTH / 2;
    //     this.ball.body.y = HEIGHT / 2;
        
    // }
    // else if (this.ball.body.x < 0)
    // {
    //     this.playerTwoScore.setText(parseInt(this.playerTwoScore.text) + 1);
    //     this.ball.body.x = WIDTH / 2;
    //     this.ball.body.y = HEIGHT / 2;
    // }
}