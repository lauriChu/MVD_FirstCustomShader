#version 330

in vec2 v_uv;

out vec4 fragColor;

uniform sampler2D u_screen_texture;
uniform vec3 u_blur;


const int indexMatrix4x4[16] = int[](0,  8,  2,  10,
                                     12, 4,  14, 6,
                                     3,  11, 1,  9,
                                     15, 7,  13, 5);

float indexValue() {
    int x = int(mod(gl_FragCoord.x, 4));
    int y = int(mod(gl_FragCoord.y, 4));
    return indexMatrix4x4[(x + y * 4)] / 16.0;
}

float dither(float color) {
    float closestColor = (color < 0.5) ? 0 : 1;
    float secondClosestColor = 1 - closestColor;
    float d = indexValue();
    float distance = abs(closestColor - color);
    return (distance < d) ? closestColor : secondClosestColor;
}

float gauss(float x, float x2) {
	double c = 1.0 / (2.0 * 3.1415926 * x2);
	double e = -(x * x)/(2.0 *x2);
	return (float)(c * exp(e));
}


void main(){
    vec3 col = texture(u_screen_texture, v_uv).xyz;
    
	vec4 sum = vec4(0.0);

	vec2 tc = gl_FragCoord.xy / textureSize(u_screen_texture, 0).xy;

	float blur = 2.0;
	float hstep = 1.0;
	float vstep = 0.0;


	sum += texture(u_screen_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
	sum += texture(u_screen_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
	sum += texture(u_screen_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
	sum += texture(u_screen_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;
	
	sum += texture(u_screen_texture, vec2(tc.x, tc.y)) * 0.2270270270;
	
	sum += texture(u_screen_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
	sum += texture(u_screen_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
	sum += texture(u_screen_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
	sum += texture(u_screen_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;

	//discard alpha for our simple demo, multiply by vertex color and return
	//gl_FragColor = vColor * vec4(sum.rgb, 1.0);
	
	
	fragColor = vec4(vec3(0.0,0.1,0.0) , 1.0) * vec4(sum.rgb, 1.0);
}
