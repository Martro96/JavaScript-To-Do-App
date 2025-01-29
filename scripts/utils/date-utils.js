export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        day: 'numeric',
        month: 'long',  
        year: 'numeric' 
    });
}