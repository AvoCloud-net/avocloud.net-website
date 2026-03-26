// By TFJ - 26.03.2026

// Function so it loads onload
(function() {

    // Status enum
    const ComparisonStatus = Object.freeze({
        FREE: 'FREE',
        PREMIUM: 'PREMIUM',
        PARTIAL: 'PARTIAL',
        NONE: 'NONE'
    });

    // Legend
    const ComparisonStatusConfig = {
        [ComparisonStatus.FREE]: { symbol: '✓', class: 'status-check', label: 'free' },
        [ComparisonStatus.PREMIUM]: { symbol: '★', class: 'status-premium', label: 'premium only' },
        [ComparisonStatus.PARTIAL]: { symbol: '~', class: 'status-partial', label: 'partial / limited' },
        [ComparisonStatus.NONE]: { symbol: '✗', class: 'status-none', label: 'not available' }
    };

    // Data
    const ComparisonData = {
        headers: {
            feature: 'Feature',
            baxi: 'Baxi',
            mee6: 'MEE6',
            carl: 'Carl-bot',
            dyno: 'Dyno',
            probot: 'ProBot'
        },
        rows: [
            {
                feature: 'Moderation (warn / kick / ban / timeout)',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PARTIAL, tooltip: 'Basic commands free; full auto-mod plugin is premium' },
                    carl: { status: ComparisonStatus.FREE },
                    dyno: { status: ComparisonStatus.FREE },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'AI Chat Filter',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.NONE },
                    carl: { status: ComparisonStatus.NONE },
                    dyno: { status: ComparisonStatus.NONE },
                    probot: { status: ComparisonStatus.NONE }
                }
            },
            {
                feature: 'Anti-Spam',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PREMIUM, tooltip: 'Premium only' },
                    carl: { status: ComparisonStatus.FREE },
                    dyno: { status: ComparisonStatus.FREE },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'Auto-Slowmode',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.NONE },
                    carl: { status: ComparisonStatus.NONE },
                    dyno: { status: ComparisonStatus.PREMIUM, tooltip: 'Premium only' },
                    probot: { status: ComparisonStatus.NONE }
                }
            },
            {
                feature: 'Button / Reaction Roles',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PREMIUM, tooltip: 'Premium only' },
                    carl: { status: ComparisonStatus.FREE },
                    dyno: { status: ComparisonStatus.PARTIAL, tooltip: '3 messages free, unlimited with premium' },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'Verification System',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.NONE },
                    carl: { status: ComparisonStatus.FREE },
                    dyno: { status: ComparisonStatus.PARTIAL },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'Ticket System',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PREMIUM, tooltip: 'Premium only' },
                    carl: { status: ComparisonStatus.NONE },
                    dyno: { status: ComparisonStatus.NONE },
                    probot: { status: ComparisonStatus.NONE }
                }
            },
            {
                feature: 'Welcome Messages',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PARTIAL, tooltip: 'Basic text free; custom images/embeds premium' },
                    carl: { status: ComparisonStatus.FREE },
                    dyno: { status: ComparisonStatus.FREE },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'Auto-Roles',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.FREE },
                    carl: { status: ComparisonStatus.FREE },
                    dyno: { status: ComparisonStatus.FREE },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'Custom Commands',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PARTIAL, tooltip: 'Basic free; advanced automations premium' },
                    carl: { status: ComparisonStatus.PARTIAL, tooltip: 'Tagscript free; advanced features limited' },
                    dyno: { status: ComparisonStatus.FREE },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'Temp Voice Channels',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PREMIUM, tooltip: 'Premium only' },
                    carl: { status: ComparisonStatus.NONE },
                    dyno: { status: ComparisonStatus.NONE },
                    probot: { status: ComparisonStatus.FREE }
                }
            },
            {
                feature: 'Live Tracking (Twitch, YouTube, TikTok)',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.PREMIUM, tooltip: 'Premium only' },
                    carl: { status: ComparisonStatus.PARTIAL, tooltip: 'Twitch: 5 channels free; no TikTok' },
                    dyno: { status: ComparisonStatus.PREMIUM, tooltip: 'Premium only' },
                    probot: { status: ComparisonStatus.PARTIAL, tooltip: 'YouTube notifications available; Twitch/TikTok limited' }
                }
            },
            {
                feature: 'Network-wide Safety (Prism + Flagging)',
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.NONE },
                    carl: { status: ComparisonStatus.NONE },
                    dyno: { status: ComparisonStatus.NONE },
                    probot: { status: ComparisonStatus.NONE }
                }
            },
            {
                feature: 'Fully Free',
                isBold: true,
                values: {
                    baxi: { status: ComparisonStatus.FREE },
                    mee6: { status: ComparisonStatus.NONE },
                    carl: { status: ComparisonStatus.PARTIAL },
                    dyno: { status: ComparisonStatus.PARTIAL },
                    probot: { status: ComparisonStatus.PARTIAL }
                }
            }
        ]
    };

    // Renders comparisons table
    function renderComparisonTable() {
        const tableContainer = document.getElementById('comparison-table-container');
        if (!tableContainer) return;

        const table = document.createElement('table');
        table.className = 'compare-table';

        // Extract bot keys (all headers except 'feature')
        const botKeys = Object.keys(ComparisonData.headers).filter(key => key !== 'feature');

        // Column highlighting (colgroup)
        const colgroup = document.createElement('colgroup');
        // Feature column
        colgroup.appendChild(document.createElement('col'));
        // Bot columns
        botKeys.forEach(() => {
            colgroup.appendChild(document.createElement('col'));
        });
        table.appendChild(colgroup);

        // Thead
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Feature header first
        const featureTh = document.createElement('th');
        featureTh.textContent = ComparisonData.headers.feature;
        headerRow.appendChild(featureTh);

        // Bot headers
        botKeys.forEach((key, index) => {
            const botName = ComparisonData.headers[key];
            const th = document.createElement('th');
            th.textContent = botName;
            if (key === 'baxi') {
                th.className = 'highlight';
            }
            
            // Add hover events for column highlighting
            th.addEventListener('mouseenter', () => {
                // index + 1 because of feature column
                const cols = table.querySelectorAll('colgroup col');
                if (cols[index + 1]) cols[index + 1].classList.add('hover');
            });
            th.addEventListener('mouseleave', () => {
                const cols = table.querySelectorAll('colgroup col');
                if (cols[index + 1]) cols[index + 1].classList.remove('hover');
            });

            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Tbody
        const tbody = document.createElement('tbody');
        ComparisonData.rows.forEach(rowData => {
            const tr = document.createElement('tr');
            
            // Feature Name Cell
            const featureCell = document.createElement('td');
            featureCell.textContent = rowData.feature;
            if (rowData.isBold) {
                featureCell.style.fontWeight = '600';
            }
            tr.appendChild(featureCell);

            // Bot Value Cells
            botKeys.forEach((key) => {
                const val = rowData.values[key];
                const td = document.createElement('td');
                const config = ComparisonStatusConfig[val.status];

                // Classname
                // Baxi is highlighted
                td.className = key === 'baxi' ? "baxi-col" : "center"

                // Tooltip
                const botName = ComparisonData.headers[key];
                const statusLabel = config.label;
                td.title = val.tooltip 
                    ? `${botName}: ${val.tooltip}` 
                    : `${botName}: ${statusLabel}`;

                const span = document.createElement('span');
                span.className = config.class;
                span.textContent = config.symbol;
                
                td.appendChild(span);
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }

    // Renders legend
    function renderComparisonLegend() {
        const legendContainer = document.getElementById('comparison-legend');
        if (!legendContainer) return;

        // Clear container
        legendContainer.innerHTML = '';
        
        // Order
        const statuses = [
            ComparisonStatus.FREE,
            ComparisonStatus.PREMIUM,
            ComparisonStatus.PARTIAL,
            ComparisonStatus.NONE
        ];

        // Adds text for each status
        statuses.forEach(status => {
            const config = ComparisonStatusConfig[status];
            const span = document.createElement('span');
            
            const symbolSpan = document.createElement('span');
            symbolSpan.className = config.class;
            symbolSpan.textContent = config.symbol;
            
            span.appendChild(symbolSpan);
            span.appendChild(document.createTextNode(' ' + config.label));
            
            legendContainer.appendChild(span);
        });

        // Adds warning text
        const infoSpan = document.createElement('span');
        infoSpan.style.opacity = '0.7';
        infoSpan.style.fontStyle = 'italic';
        infoSpan.textContent = 'Based on publicly available information — may change over time.';
        legendContainer.appendChild(infoSpan);
    }

    // Render components when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        renderComparisonTable();
        renderComparisonLegend();
    });
})();
