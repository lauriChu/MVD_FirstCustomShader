#version 330

in vec2 v_uv;

out vec4 fragColor;

uniform sampler2D u_screen_texture;

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

void main(){

    vec3 col = texture(u_screen_texture, v_uv).xyz;
    float average = 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b;
	fragColor = vec4(vec3(average), 1.0);
    
}
