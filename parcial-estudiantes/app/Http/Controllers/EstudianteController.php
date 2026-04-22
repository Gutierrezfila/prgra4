<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;

class EstudianteController extends Controller
{
    // Listar todos
    public function index(Request $request)
    {
        $query = Estudiante::query();

        // Búsqueda por nombre o carnet
        if ($request->has('buscar') && $request->buscar != '') {
            $buscar = $request->buscar;
            $query->where('nombre', 'like', "%$buscar%")
                  ->orWhere('carnet', 'like', "%$buscar%")
                  ->orWhere('carrera', 'like', "%$buscar%");
        }

        return response()->json($query->get());
    }

    // Guardar nuevo
    public function store(Request $request)
    {
        $request->validate([
            'nombre'   => 'required',
            'apellido' => 'required',
            'carnet'   => 'required|unique:estudiantes',
            'carrera'  => 'required',
            'correo'   => 'required|email|unique:estudiantes',
            'promedio' => 'nullable|numeric|min:0|max:10',
        ]);

        $estudiante = Estudiante::create($request->all());
        return response()->json($estudiante, 201);
    }

    // Mostrar uno
    public function show($id)
    {
        $estudiante = Estudiante::findOrFail($id);
        return response()->json($estudiante);
    }

    // Actualizar
    public function update(Request $request, $id)
    {
        $estudiante = Estudiante::findOrFail($id);

        $request->validate([
            'nombre'   => 'required',
            'apellido' => 'required',
            'carnet'   => 'required|unique:estudiantes,carnet,' . $id,
            'carrera'  => 'required',
            'correo'   => 'required|email|unique:estudiantes,correo,' . $id,
            'promedio' => 'nullable|numeric|min:0|max:10',
        ]);

        $estudiante->update($request->all());
        return response()->json($estudiante);
    }

    // Eliminar
    public function destroy($id)
    {
        $estudiante = Estudiante::findOrFail($id);
        $estudiante->delete();
        return response()->json(['mensaje' => 'Estudiante eliminado correctamente']);
    }
}