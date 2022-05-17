/**
 * Material factory interface.
 * 
 * @author Stefan Glaser
 */
class MaterialFactory
{
	/**
	 * Create the material with the given name.
	 *
	 * @param  {string} name the unique name of the material
	 * @return {(!THREE.Material | !Array<!THREE.Material>)} the requested (multi-)material
	 *                             or a default material if the requested material definition was not found
	 */
	createMaterial (name) {}
}

export { MaterialFactory };
