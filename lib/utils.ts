export function formatRupiah(n: number | string) {
    const num = typeof n === 'string' ? Number(n) : n
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
