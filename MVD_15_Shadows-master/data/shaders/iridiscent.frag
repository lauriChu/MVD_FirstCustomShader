#version 330

//varyings and out color
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_vertex_world_pos;
out vec4 fragColor;

uniform vec3 u_cam_pos;
uniform samplerCube u_skybox;  // texture_reflection

// ratio: 1/3 = neon, 1/4 = refracted, 1/5+ = approximate white
vec3 physhue2rgb(float hue, float ratio) {
    return smoothstep(
        vec3(0.0),vec3(1.0),
        abs(mod(hue + vec3(0.0,1.0,2.0)*ratio,1.0)*2.0-1.0));
}
        
vec3 iridescence (float angle, float thickness) {

    // typically the dot product of normal with eye ray
    float NxV = cos(angle);
    
    // energy of spectral colors
    float lum = 0.05064;

    // basic energy of light
    float luma = 0.01070;

    // tint of the final color
    vec3 tint = vec3(0.49639,0.78252,0.88723);

    // interference rate at minimum angle
    float interf0 = 2.4;

    // phase shift rate at minimum angle
    float phase0 = 1.0 / 2.8;

    // interference rate at maximum angle
    float interf1 = interf0 * 4.0 / 3.0;

    // phase shift rate at maximum angle
    float phase1 = phase0;

    // fresnel
    float f = (1.0 - NxV) * (1.0 - NxV);
    float interf = mix(interf0, interf1, f);
    float phase = mix(phase0, phase1, f);
    float dp = (NxV - 1.0) * 0.5;
    
    vec3 hue = 
    		// fade in higher frequency at the right end
        	mix(
                physhue2rgb(thickness * interf0 + dp, thickness * phase0),
    			physhue2rgb(thickness * interf1 + 0.1 + dp, thickness * phase1),
                f);
    
    vec3 film = hue * lum + vec3(0.49639,0.78252,0.88723) * luma;
    
    return vec3((film * 3.0 + pow(f,12.0))) * tint;
}

vec3 srgb2lin(vec3 color) {
    return color * (color * (
        color * 0.305306011 + 0.682171111) + 0.012522878);
}

vec3 lin2srgb(vec3 color) {
    vec3 S1 = sqrt(color);
    vec3 S2 = sqrt(S1);
    vec3 S3 = sqrt(S2);
    return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;
}

void main(){
    //calculate direction to camera in world space
    vec3 I = normalize(v_vertex_world_pos - u_cam_pos);
    vec3 R = reflect(I, normalize(v_normal));

	vec3 c = iridescence(R.x*0.5*3.14159, 1.0-R.y);
	fragColor = vec4(lin2srgb(c),1.0);
}
