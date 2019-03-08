#version 330

//varyings and out color
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_vertex_world_pos;
out vec4 fragColor;

uniform vec3 u_cam_pos;
uniform samplerCube u_skybox;  // texture_reflection

void main(){
    //calculate direction to camera in world space
    vec3 I = normalize(v_vertex_world_pos - u_cam_pos);
    vec3 R = reflect(I, normalize(v_normal));

	vec3 reflect_color = texture(u_skybox, R).rgb;

	vec3 col = reflect_color;
	col = pow(col, vec3(0.8,0.85,0.9));
	col *= 0.5 + 0.5*pow( 16.0*v_uv.x*v_uv.y*(1.0-v_uv.x)*(1.0-v_uv.y), 0.1 );
	fragColor = vec4(col,1.0);
}
