
// Mock de notas para prueba
const notes = [
    { id: 1, title: 'Nota antigua', created_at: '2023-01-01T10:00:00Z' },
    { id: 2, title: 'Nota nueva', created_at: '2023-12-31T10:00:00Z' },
    { id: 3, title: 'Nota editada reciente', created_at: '2023-06-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
    { id: 1700000000000, title: 'Nota por ID timestamp' } // ID timestamp reciente
];

function sortNotes(notesList) {
    return notesList.sort((a, b) => {
        const getTimestamp = (n) => {
            if (n.updated_at) return new Date(n.updated_at).getTime();
            if (n.created_at) return new Date(n.created_at).getTime();
            if (typeof n.id === 'number') return n.id;
            if (!isNaN(n.id) && Number(n.id) > 1000000000000) return Number(n.id);
            return 0;
        };
        return getTimestamp(b) - getTimestamp(a);
    });
}

console.log('--- Iniciando prueba de ordenamiento ---');
const sorted = sortNotes([...notes]);

console.log('Orden esperado:');
console.log('1. Nota editada reciente (2024)');
console.log('2. Nota nueva (2023-12)');
console.log('3. Nota por ID timestamp (aprox 2023-11)');
console.log('4. Nota antigua (2023-01)');

console.log('\nOrden obtenido:');
sorted.forEach(n => console.log(`- ${n.title} (ID: ${n.id})`));

// Validaciones
const success = 
    sorted[0].id === 3 && 
    sorted[1].id === 2 && 
    sorted[3].id === 1;

if (success) {
    console.log('\n✅ PRUEBA EXITOSA: Las notas se ordenaron correctamente.');
} else {
    console.error('\n❌ PRUEBA FALLIDA: El orden no es el esperado.');
    process.exit(1);
}
