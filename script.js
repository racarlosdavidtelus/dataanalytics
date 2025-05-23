// DOM Elements
const initialScreen = document.getElementById('initial-screen');
const eventQuestionsScreen = document.getElementById('event-questions');
const templateScreen = document.getElementById('template-screen');
const actionButtons = document.querySelectorAll('.action-btn');
const backButton = document.getElementById('backButton');
const templateEditor = document.getElementById('templateEditor');
const previewContent = document.getElementById('previewContent');
const copyBtn = document.getElementById('copyToClipboard');
const exportBtn = document.getElementById('exportTemplate');
const eventTypeSelect = document.getElementById('eventType');
const eventNameInput = document.getElementById('eventName');
const eventPropertiesInput = document.getElementById('eventProperties');
const generateEventTemplateBtn = document.getElementById('generateEventTemplate');

// Make template editor read-only
templateEditor.readOnly = true;

// State
let currentTemplate = null;
let currentScreen = 'initial';

// Static templates
const templates = {
    "pageLoad": {
        "title": "Page Load Event",
        "template": "# Page Load Event\n\n## Implementation\n\n```javascript\nwindow.adobeDataLayer.push({\n  event: \"pageLoaded\",\n  eventInfo:\n    \"This and 'event' are removed when getState is called so won't show in XDM\",\n  xdm: {\n    web: {\n      webPageDetails: {\n        pageViews: {\n          value: 1,\n        },\n        name: \"<page_name>\",\n        URL: document.location.href,\n        server: document.location.origin,\n        siteSection: \"<site_section>\",\n        _telus: {\n          accessMotion: \"<access_motion>\",\n          accessVoice: \"<access_voice>\",\n          accountRole: \"<account_role>\",\n          adobeDataLayerBuilder: \"alloyAnalytics\", // if using starter kit, otherwise use \"custom\"\n          banCount: \"<ban_count>\",\n          banType: \"<ban_type>\",\n          billCycleEnd: \"<bill_cycle_end_date>\",\n          billCycleStart: \"<bill_cycle_start_date>\",\n          catalogueType: \"<article_type>\",\n          colophonID: \"<colophon_id>\",\n          customPageViews: 1,\n          customSiteSection: \"<site_section>\",\n          dataLayerType: \"acdl\",\n          dataRemaining: \"<data_remaining>\",\n          dataTotal: \"<data_total>\",\n          dataUsed: \"<data_used>\",\n          daysRemaining: \"<days_remaining>\",\n          displayMode: \"<display_mode>\",\n          edgeServer: \"<edge_server>\",\n          eKnowID: \"<eknow_id>\",\n          encryptedBan: \"<encrypted_ban>\",\n          evsId: \"<evs_uuid>\",\n          fontSize: \"<font_size>\",\n          knowledgeBaseArticleCategory: \"<article_category>\",\n          knowledgeBaseArticleID: \"<article_id>\",\n          knowledgeBaseArticleType: \"<article_type>\",\n          lob: \"<lob>\",\n          loyaltyID: \"<loyalty_id>\",\n          loyaltyTier: \"<loyalty_tier>\",\n          nternetType: \"<internet_type>\",\n          orderBasedDrop: \"<order_based_drop>\",\n          orderType: \"<order_type>\",\n          overageFlag: \"<overage_flag>\",\n          pageLanguage: \"<page_language>\",\n          pageName: \"<page_name>\",\n          pageType: \"<page_type>\",\n          pageURL: \"<page_url>\",\n          previousPageType: \"<previous_page_name>\",\n          primarySiteSection: \"<sub_section>\",\n          prodAvail: \"<product_availability>\",\n          prodElig: \"<product_eligibility>\",\n          prodOwned: \"<product_owned>\",\n          prospectID: \"<prospect_id>\",\n          province: \"<province>\",\n          quaternarySiteSection: \"<sub_section_4>\",\n          rcid: \"<rcid>\",\n          secondarySiteSection: \"<sub_section_2>\",\n          site: \"<site>\",\n          siteGenerator: \"<site_generator>\",\n          subCount: \"<subscriber_count>\",\n          subID: \"<subscriber_id>\",\n          subKey: \"<subscriber_key>\",\n          subscriptionID: \"<subscription_id>\",\n          tagManager: \"adobe_launch\",\n          tertiarySiteSection: \"<sub_section_3>\",\n          tvType: \"<tv-type>\",\n          urlRedirect: \"<url_redirect>\",\n          userAccountID: \"<account_id>\",\n          userAccountType: \"<account_type>\",\n          userLoginStatus: \"<login_status>\",\n          userStatus: \"<user_status>\",\n          userSystem: \"<user_system>\",\n          webApp: \"web\",\n          wifiID: \"<wifi_id>\",\n          wirelineAccounts: \"<wireline_accounts>\",\n        },\n      },\n    },\n  },\n});\n```"
    },
    "tracking": {
        "baseTemplate": "# {eventType}\n\n## Implementation\n\n```javascript\nimport { trackEvent } from '@company/analytics-sdk';\n\n{eventImplementation}\n```\n\n## Event Properties\n\n| Property | Type | Required | Description |\n|----------|------|----------|-------------|\n{eventProperties}"
    }
};

// Event template generators
const eventImplementations = {
    click: (name, properties) => `// Track click event
document.querySelector('${properties.includes('selector') ? properties[properties.indexOf('selector') + 1] || 'button' : 'button'}').addEventListener('click', () => {
    trackEvent('${name}', {
${properties.map(prop => `        ${prop}: 'value'`).join(',\n')}
    });
});`,
    form: (name, properties) => `// Track form submission
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    trackEvent('${name}', {
${properties.map(prop => `        ${prop}: 'value'`).join(',\n')}
    });
});`,
    custom: (name, properties) => `// Track custom event
trackEvent('${name}', {
${properties.map(prop => `    ${prop}: 'value'`).join(',\n')}
});`
};

// Update preview
function updatePreview() {
    const content = templateEditor.value;
    previewContent.textContent = content;
}

// Copy to clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(templateEditor.value);
        alert('Content copied to clipboard!');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Failed to copy to clipboard');
    }
}

// Export as MD
function exportAsMD() {
    if (!templateEditor.value) {
        alert('No content to export');
        return;
    }

    const blob = new Blob([templateEditor.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate || 'template'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show screen
function showScreen(screenId) {
    [initialScreen, eventQuestionsScreen, templateScreen].forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    currentScreen = screenId;
}

// Show template screen
function showTemplateScreen(templateKey) {
    if (templateKey === 'tracking') {
        showScreen('event-questions');
    } else {
        showScreen('template-screen');
        loadTemplateContent(templateKey);
        updatePreview();
    }
}

// Load template content
function loadTemplateContent(templateKey) {
    if (templates[templateKey]) {
        currentTemplate = templateKey;
        templateEditor.value = templates[templateKey].template;
        updatePreview();
    } else {
        console.error(`Template not found: ${templateKey}`);
        templateEditor.value = `Error: Template "${templateKey}" not found.`;
        updatePreview();
    }
}

// Generate event template
function generateEventTemplate() {
    const eventType = eventTypeSelect.value;
    const eventName = eventNameInput.value;
    const properties = eventPropertiesInput.value.split('\n').filter(prop => prop.trim() !== '');
    
    if (!eventType || !eventName) {
        alert('Please fill in all required fields.');
        return;
    }

    const implementation = eventImplementations[eventType](eventName, properties);
    const propertiesTable = properties.map(prop => `| ${prop} | any | No | Description for ${prop} |`).join('\n');

    const template = templates.tracking.baseTemplate
        .replace('{eventType}', `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event`)
        .replace('{eventImplementation}', implementation)
        .replace('{eventProperties}', propertiesTable);

    currentTemplate = 'tracking';
    templateEditor.value = template;
    updatePreview();
    showScreen('template-screen');
}

// Event Listeners
actionButtons.forEach(button => {
    button.addEventListener('click', (e) => showTemplateScreen(e.target.dataset.template));
});
backButton.addEventListener('click', () => showScreen('initial-screen'));
templateEditor.addEventListener('input', updatePreview);
copyBtn.addEventListener('click', copyToClipboard);
exportBtn.addEventListener('click', exportAsMD);
generateEventTemplateBtn.addEventListener('click', generateEventTemplate);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showScreen('initial-screen');
});
