#version 330

//varyings and out color
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_vertex_world_pos;
out vec4 fragColor;

uniform vec3 u_cam_pos;
uniform samplerCube u_skybox;  // texture_reflection

const float mother_pearl_brightness = 1.5;
#define pi 3.14159265358979323846

float iridescence(float thickness, float facing, float wavelength) {
	return sin(2.0 * pi * thickness / (facing * wavelength)) * 0.5 + 0.5;
}

void main(){
    //calculate direction to camera in world space
    //vec3 I = normalize(v_vertex_world_pos - u_cam_pos);
    //vec3 R = reflect(I, normalize(v_normal));

    //vec3 reflect_color = texture(u_skybox, R).rgb;
    
	vec3 fvNormal = normalize(v_normal);
	vec3 fvViewDirection = normalize(v_vertex_world_pos - u_cam_pos);
	vec3 fvReflection = normalize(reflect(fvViewDirection, fvNormal));

	float view_dot_normal = max(dot(fvNormal, fvViewDirection), 0.0);
	float view_dot_normal_inverse = 1.0 - view_dot_normal;

	vec3 reflect_color = texture(u_skybox, fvReflection).rgb;

	//fragColor = vec4 (texture(u_skybox, fvReflection).rgb * view_dot_normal, 1.0);

	//fragColor = vec4(reflect_color, 1.0);
	fragColor = vec4(	iridescence(v_uv.x * 100, v_uv.y, 700.),
						iridescence(v_uv.x * 100, v_uv.y, 700.),
						iridescence(v_uv.x * 100, v_uv.y, 700.),
						1.0
					);

	/*vec3 col = reflect_color;
	col = pow(col, vec3(0.8,0.85,0.9));
	col *= 0.5 + 0.5*pow( 16.0*v_uv.x*v_uv.y*(1.0-v_uv.x)*(1.0-v_uv.y), 0.1 );
	fragColor = vec4(col,1.0);*/
}
