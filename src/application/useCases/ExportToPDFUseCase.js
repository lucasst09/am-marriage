import { GuestRepository } from '../../infrastructure/repositories/GuestRepository.js';

/**
 * Caso de uso para exportar confirmações para PDF
 */
export class ExportToPDFUseCase {
  constructor(confirmationRepository, guestRepository = new GuestRepository()) {
    this.confirmationRepository = confirmationRepository;
    this.guestRepository = guestRepository;
  }

  /**
   * Executa o caso de uso de exportação
   * @returns {Object} Resultado da operação
   */
  async execute() {
    try {
      const { jsPDF } = await import('jspdf');
      
      const confirmations = this.confirmationRepository.getAll();
      const doc = new jsPDF();
      
      // Cabeçalho do documento
      doc.setFontSize(20);
      doc.text('Lista de Confirmações - Casamento A & M', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
      doc.text(`Total de confirmações: ${confirmations.length}`, 20, 35);
      
      let y = 50;
      let contador = 1;
      
      // Cabeçalho da tabela
      doc.setFontSize(10);
      doc.text('Nº', 20, y);
      doc.text('Nome', 30, y);
      doc.text('Status', 80, y);
      doc.text('Tipo', 120, y);
      doc.text('Telefone', 160, y);
      doc.text('Observações', 20, y + 5);
      
      doc.line(20, y + 8, 190, y + 8);
      y += 15;
      
      // Processar cada confirmação
      confirmations.forEach(confirmation => {
        const guestGroup = this.guestRepository.findGuestGroupByName(confirmation.guestName);
        
        if (!guestGroup) return;
        
        // Processar todas as pessoas do grupo
        const allPeople = this._getAllPeopleFromGroup(guestGroup, confirmation);
        
        allPeople.forEach((person, index) => {
          if (y > 270) { // Nova página se necessário
            doc.addPage();
            y = 20;
          }
          
          // Nome e status na primeira linha
          doc.setFontSize(9);
          doc.text(contador.toString(), 20, y);
          doc.text(person.nome, 30, y);
          doc.text(person.status, 80, y);
          doc.text(person.tipo, 120, y);
          
          // Só mostrar telefone e observações na primeira pessoa do grupo
          if (index === 0) {
            doc.text(confirmation.telefone || '-', 160, y);
            
            y += 5;
            
            // Observações na segunda linha
            if (confirmation.observacoes) {
              doc.text(`Obs: ${confirmation.observacoes}`, 20, y);
              y += 5;
            }
            
            // Data da confirmação
            const dataConfirmacao = new Date(confirmation.dataConfirmacao).toLocaleDateString('pt-BR');
            doc.text(`Confirmado em: ${dataConfirmacao}`, 20, y);
          } else {
            // Para acompanhantes, deixar telefone e observações vazios
            doc.text('-', 160, y);
          }
          
          y += 10;
          contador++;
        });
      });
      
      // Estatísticas no final
      const statistics = this.confirmationRepository.getStatistics();
      y += 10;
      doc.setFontSize(12);
      doc.text('RESUMO INDIVIDUAL:', 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(`• Total de pessoas que vão: ${statistics.totalAttending}`, 20, y);
      y += 5;
      doc.text(`• Total de pessoas que não vão: ${statistics.totalNotAttending}`, 20, y);
      y += 5;
      doc.text(`• Convidados principais que vão: ${statistics.mainGuestsAttending}`, 20, y);
      y += 5;
      doc.text(`• Convidados principais que não vão: ${statistics.mainGuestsNotAttending}`, 20, y);
      y += 5;
      doc.text(`• Acompanhantes que vão: ${statistics.dependentsAttending}`, 20, y);
      y += 5;
      doc.text(`• Acompanhantes que não vão: ${statistics.dependentsNotAttending}`, 20, y);
      y += 5;
      doc.text(`• Total de pessoas no evento: ${statistics.totalAttending}`, 20, y);
      
      const fileName = `confirmacoes-casamento-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      return {
        success: true,
        error: null,
        data: { fileName }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao gerar PDF. Verifique se a biblioteca jsPDF está instalada.',
        data: null
      };
    }
  }

  /**
   * Obtém todas as pessoas de um grupo com seus status
   */
  _getAllPeopleFromGroup(guestGroup, confirmation) {
    const allPeople = [];
    
    // Adicionar o convidado principal
    const mainGuest = guestGroup.getMainGuest();
    if (mainGuest) {
      allPeople.push({
        nome: mainGuest.nome,
        status: confirmation.isMainGuestAttending() ? 'Vai comparecer' : 'Não vai comparecer',
        tipo: 'Principal'
      });
    }
    
    // Adicionar dependentes
    const dependents = guestGroup.getDependents();
    dependents.forEach(dependent => {
      allPeople.push({
        nome: dependent.nome,
        status: confirmation.isDependentAttending(dependent.id) ? 'Vai comparecer' : 'Não vai comparecer',
        tipo: 'Acompanhante'
      });
    });
    
    return allPeople;
  }
}
