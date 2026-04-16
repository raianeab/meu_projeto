const { getDashboardByCompany } = require('../services/dashboardService');
const {
    getEmbedUrl,
    generateEmbedToken
} = require('../services/powerBIService');

const dashboardController = {
    async index(req, res) {
  try {
    const user = req.session.user;
    const companyId = user.company_id;

    const dashboard = await getDashboardByCompany(companyId);

    if (!dashboard) {
      return res.status(403).render('pages/error', {
        message: 'Dashboard não disponível para esta empresa',
        error: { status: 403 }
      });
    }

    let embedUrl = null;
    let embedToken = null;
    let reportId = null;

    if (
      dashboard.power_bi_workspace_id &&
      dashboard.power_bi_report_id
    ) {
      reportId = dashboard.power_bi_report_id;

      embedUrl = await getEmbedUrl({
        workspaceId: dashboard.power_bi_workspace_id,
        reportId
      });

      embedToken = await generateEmbedToken({
        workspaceId: dashboard.power_bi_workspace_id,
        reportId
      });
    }

    res.render('pages/dashboard', {
      company: dashboard,
      user,
      embedUrl,
      embedToken,
      reportId
    });

  } catch (err) {
    console.error('=== ERROR ===');
    console.error(err);
    res.status(500).render('pages/error', {
      message: 'Erro ao carregar o dashboard',
      error: { status: 500 }
    });
  }
  
}

};

module.exports = dashboardController;
