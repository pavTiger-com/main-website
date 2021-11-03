#!/bin/bash

read animation_name

for filename in animations/$animation_name/*.obj; do
	echo $filename    
	split_filename=(${filename//./ }[0])  # Split by '.' to remove '.obj'
	obj2gltf -i $filename -o ${split_filename}.glb  # Command to convert .obj to .glb
done
