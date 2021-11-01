#!/bin/bash
for filename in flush/*.obj; do
	echo $filename.glb    
	obj2gltf -i $filename -o $filename.glb
done
