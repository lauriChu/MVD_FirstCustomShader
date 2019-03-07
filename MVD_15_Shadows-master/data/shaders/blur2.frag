#version 330

in vec2 v_uv;

out vec4 fragColor;

uniform sampler2D u_screen_texture;

//"in" attributes from our vertex shader
varying vec4 vColor;

//declare uniforms
//uniform sampler2D u_texture;
uniform float resolution;
uniform float radius;
uniform vec2 dir;

void main() {
    //this will be our RGBA sum
    vec4 sum = vec4(0.0);
    
    //our original texcoord for this fragment
    vec2 vTexCoord = gl_FragCoord.xy / textureSize(u_screen_texture, 0).xy;
    
    //the amount to blur, i.e. how far off center to sample from 
    //1.0 -> blur by one pixel
    //2.0 -> blur by two pixels, etc.
    float blur = 1.0; 
    
    //the direction of our blur
    //(1.0, 0.0) -> x-axis blur
    //(0.0, 1.0) -> y-axis blur
    float hstep = gl_FragCoord.x;
    float vstep = gl_FragCoord.y;
    
    //apply blurring, using a 9-tap filter with predefined gaussian weights
    
    sum += texture2D(u_screen_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
    sum += texture2D(u_screen_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
    sum += texture2D(u_screen_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
    sum += texture2D(u_screen_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;
    
    sum += texture2D(u_screen_texture, vec2(tc.x, tc.y)) * 0.2270270270;
    
    sum += texture2D(u_screen_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
    sum += texture2D(u_screen_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
    sum += texture2D(u_screen_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
    sum += texture2D(u_screen_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;

    //discard alpha for our simple demo, multiply by vertex color and return
    vec3 col = texture(u_screen_texture, v_uv).xyz;
    fragColor = 1 * vec4(sum.rgb, 1.0);
}

/*void main(){

    vec3 col = texture(u_screen_texture, v_uv).xyz;
    float average = 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b;
	fragColor = vec4(vec3(average), 1.0);
    
}*/
